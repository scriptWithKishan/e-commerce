import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ProductTable from "./product-table";


export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/register");
  }

  const products = await prisma.product.findMany({
    where: {
      sellerId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      salePrice: true,
      slug: true,
      stockQty: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    slug: product.slug,
    stockQty: product.stockQty,
    category: product.category,
  }));

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-bold text-black mb-8">Products</h1>
      <div className="w-full flex justify-center">
        <ProductTable products={formattedProducts} />
      </div>
    </div>
  )
}