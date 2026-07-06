import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please login to add items to cart." },
        { status: 401 }
      );
    }

    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1." },
        { status: 400 }
      );
    }

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    if (product.stockQty < quantity) {
      return NextResponse.json(
        { error: `Only ${product.stockQty} items available in stock.` },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Find or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stockQty) {
        return NextResponse.json(
          { error: `Cannot add more. Only ${product.stockQty} items available.` },
          { status: 400 }
        );
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });

      return NextResponse.json({
        message: "Cart item quantity updated.",
        item: updatedItem,
      });
    } else {
      // Add new item to cart
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: { product: true },
      });

      return NextResponse.json({
        message: "Item added to cart.",
        item: newItem,
      });
    }
  } catch (error: any) {
    console.error("Cart error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// GET - Get user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                salePrice: true,
                images: true,
                stockQty: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ cart: cart || { items: [] } });
  } catch (error: any) {
    console.error("Cart error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// DELETE - Remove entire cart
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await prisma.cart.delete({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ message: "Cart deleted." });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ message: "Cart already empty." });
    }
    console.error("Cart error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}