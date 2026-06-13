import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation";
import AddProductForm from "./add-product-form";


export default async function AddProductPage() {

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  })

  return (
    <div className="p-8 flex flex-col w-full">
      <h1 className="text-3xl font-bold text-black">Add Products</h1>
      <AddProductForm
        categories={categories}
      />
    </div>
  )
}