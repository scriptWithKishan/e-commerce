import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import CartClient from "./cart-client"

export default async function CartPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/register")
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
              stockQty: true
            }
          }
        }
      }
    }
  })

  // Transform Prisma data
  const transformedCart = cart ? {
    id: cart.id,
    items: cart.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        ...item.product,
        price: Number(item.product.price),
        salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
      }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <CartClient initialCart={transformedCart} />
    </div>
  )
}