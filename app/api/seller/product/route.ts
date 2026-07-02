import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface ProductImage {
  url: string;
  altText: string;
  isPrimary: boolean;
}

function getCloudinaryPublicId(url: string): string | null {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    
    const pathAfterUpload = parts[1];
    const pathParts = pathAfterUpload.split("/");
    if (pathParts[0].startsWith("v") && /^\d+$/.test(pathParts[0].substring(1))) {
      pathParts.shift();
    }
    
    const fullPath = pathParts.join("/");
    const lastDotIndex = fullPath.lastIndexOf(".");
    if (lastDotIndex === -1) return fullPath;
    return fullPath.substring(0, lastDotIndex);
  } catch (err) {
    return null;
  }
}

async function deleteFromCloudinary(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Cloudinary credentials missing in env");
    return;
  }

  const timestamp = Math.round(new Date().getTime() / 1000).toString();
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(signatureString).digest("hex");

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to delete image from Cloudinary:", errText);
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { productIds } = await req.json();
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "Product IDs are required as a non-empty array" }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { images: true }
    });

    for (const product of products) {
      const images = (product.images as unknown as ProductImage[]) || [];
      for (const image of images) {
        const publicId = getCloudinaryPublicId(image.url);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }
    }

    await prisma.product.deleteMany({
      where: { id: { in: productIds } }
    });

    return NextResponse.json({ message: "Products deleted successfully" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, name, description, price, salePrice, slug, stockQty } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updateData: {
      name?: string;
      description?: string;
      price?: number;
      salePrice?: number | null;
      slug?: string;
      stockQty?: number;
    } = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (salePrice !== undefined) {
      updateData.salePrice = salePrice === "" || salePrice === null ? null : Number(salePrice);
    }
    if (slug !== undefined) updateData.slug = slug;
    if (stockQty !== undefined) updateData.stockQty = parseInt(stockQty, 10);

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update provided" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData
    });

    return NextResponse.json({ message: "Product updated successfully", product }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal server error" },
      { status: 500 }
    );
  }
}