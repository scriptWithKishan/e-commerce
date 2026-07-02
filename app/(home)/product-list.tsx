import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductListClient from "./product-list-client";

type ProductImage = {
  url: string;
  altText: string;
  isPrimary: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  stockQty: number;
  images: ProductImage[];
  tags: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

interface ProductListProps {
  categorySlug?: string;
  searchParams?: {
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  };
}

export default async function ProductList({
  categorySlug,
  searchParams,
}: ProductListProps) {
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
    } else {
      notFound();
    }
  }

  // Stock filter
  if (searchParams?.inStock === "true") {
    whereClause.stockQty = { gt: 0 };
  }

  // Price filter
  const minPrice = searchParams?.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? Number(searchParams.maxPrice) : undefined;

  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.OR = [
      { price: {} },
      { salePrice: {} },
    ];

    if (minPrice !== undefined) {
      (whereClause.OR as Record<string, unknown>[])[0].price = { ...((whereClause.OR as Record<string, unknown>[])[0].price as object || {}), gte: minPrice };
      (whereClause.OR as Record<string, unknown>[])[1].salePrice = { ...((whereClause.OR as Record<string, unknown>[])[1].salePrice as object || {}), gte: minPrice };
    }
    if (maxPrice !== undefined) {
      (whereClause.OR as Record<string, unknown>[])[0].price = { ...((whereClause.OR as Record<string, unknown>[])[0].price as object || {}), lte: maxPrice };
      (whereClause.OR as Record<string, unknown>[])[1].salePrice = { ...((whereClause.OR as Record<string, unknown>[])[1].salePrice as object || {}), lte: maxPrice };
    }
  }

  // Build orderBy
  let orderBy: Record<string, string> = { createdAt: "desc" };

  switch (searchParams?.sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "name-asc":
      orderBy = { name: "asc" };
      break;
    case "name-desc":
      orderBy = { name: "desc" };
      break;
    case "date-asc":
      orderBy = { createdAt: "asc" };
      break;
    case "date-desc":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  // Fetch one extra to check if there are more results
  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
    },
    take: 9,
    orderBy,
  });

  // Check if there are more results
  const hasMore = products.length > 8;
  const displayProducts = hasMore ? products.slice(0, -1) : products;

  const productData: Product[] = displayProducts.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    stockQty: product.stockQty,
    images: product.images as ProductImage[],
    tags: product.tags || [],
    category: product.category,
  }));

  return (
    <ProductListClient
      key={`${categorySlug || ""}_${JSON.stringify(searchParams || {})}`}
      initialProducts={productData}
      hasMore={hasMore}
      categorySlug={categorySlug}
    />
  );
}
