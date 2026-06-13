import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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