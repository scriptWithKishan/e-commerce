import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Params = {
  params: Promise<{ itemId: string }>;
};

// PATCH - Update cart item quantity
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { itemId } = await params;
    const { quantity } = await req.json();

    if (quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1." },
        { status: 400 }
      );
    }

    // Get the cart item and verify it belongs to user's cart
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true, product: true },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
    }

    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Check stock
    if (quantity > cartItem.product.stockQty) {
      return NextResponse.json(
        { error: `Only ${cartItem.product.stockQty} items available.` },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json({
      message: "Cart item updated.",
      item: updatedItem,
    });
  } catch (error: any) {
    console.error("Cart item error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// DELETE - Remove cart item
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { itemId } = await params;

    // Get the cart item and verify it belongs to user's cart
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
    }

    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: "Cart item removed." });
  } catch (error: any) {
    console.error("Cart item error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
