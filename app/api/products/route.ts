import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products - Fetch products with pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageSize = parseInt(searchParams.get("pageSize") || "8");
    const cursor = searchParams.get("cursor");
    const categorySlug = searchParams.get("categorySlug");
    const sort = searchParams.get("sort");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock") === "true";

    // Recursive function to get all nested children
    async function getAllChildren(categoryId: string): Promise<string[]> {
      const children = await prisma.category.findMany({
        where: { parentId: categoryId },
        select: { id: true },
      });

      let allIds: string[] = [];
      for (const child of children) {
        allIds.push(child.id);
        const nestedChildren = await getAllChildren(child.id);
        allIds = [...allIds, ...nestedChildren];
      }
      return allIds;
    }

    // Build where clause
    const whereClause: Record<string, unknown> = {};

    // Category filter
    if (categorySlug) {
      const selectedCategory = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });

      if (selectedCategory) {
        const childIds = await getAllChildren(selectedCategory.id);
        const categoryIds = [selectedCategory.id, ...childIds];
        whereClause.categoryId = { in: categoryIds };
      }
    }

    // Stock filter
    if (inStock) {
      whereClause.stockQty = { gt: 0 };
    }

    // Price filter
    if (minPrice || maxPrice) {
      whereClause.OR = [
        { price: {} },
        { salePrice: {} },
      ];

      if (minPrice) {
        (whereClause.OR as Record<string, unknown>[])[0].price = { gte: Number(minPrice) };
        (whereClause.OR as Record<string, unknown>[])[1].salePrice = { gte: Number(minPrice) };
      }
      if (maxPrice) {
        (whereClause.OR as Record<string, unknown>[])[0].price = { ...((whereClause.OR as Record<string, unknown>[])[0].price as object), lte: Number(maxPrice) };
        (whereClause.OR as Record<string, unknown>[])[1].salePrice = { ...((whereClause.OR as Record<string, unknown>[])[1].salePrice as object), lte: Number(maxPrice) };
      }
    }

    // Build orderBy
    let orderBy: Record<string, string> = { createdAt: "desc" };
    switch (sort) {
      case "price-asc": orderBy = { price: "asc" }; break;
      case "price-desc": orderBy = { price: "desc" }; break;
      case "name-asc": orderBy = { name: "asc" }; break;
      case "name-desc": orderBy = { name: "desc" }; break;
      case "date-asc": orderBy = { createdAt: "asc" }; break;
    }

    // Fetch products
    const products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy,
    });

    const hasMore = products.length > pageSize;
    const displayProducts = hasMore ? products.slice(0, -1) : products;

    return NextResponse.json({
      products: displayProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        stockQty: p.stockQty,
        images: p.images,
        tags: p.tags || [],
        category: p.category,
      })),
      hasMore,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, price, salePrice, stockQty, categoryId, tags, images } = body;

    if (!name || !slug || !description || !price || stockQty === undefined) {
      return NextResponse.json(
        { error: "Missing required fields!" },
        { status: 400 }
      )
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists!" },
        { status: 409 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        salePrice: salePrice ?? null,
        stockQty,
        categoryId: categoryId ?? null,
        tags: tags ?? [],
        images: images ?? [],
      }
    })
    return NextResponse.json(
      product,
      { status: 201 }
    )
  } catch (e: any) {
    return NextResponse.json(
      { error: "Internal server error!" + e.message },
      { status: 500 }
    )
  }
}