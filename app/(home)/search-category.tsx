import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";
import CategoryList from "./category-list";

export default async function SearchCategory() {

  // Get all root categories (those with no parent - these are the top-level categories)
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: {
        orderBy: {
          name: "asc"
        }
      }
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col gap-2 text-black">
      <div className="flex items-center justify-center gap-2 p-5">
        <input type="text" placeholder="Search" className="p-2 border border-slate-200 dark:border-zinc-700 rounded-lg w-[500px] pl-2" />
        <button
          className="bg-black text-white p-2.5 rounded-lg cursor-pointer"
        >
          <Search size={20} />
        </button>
      </div>
      <CategoryList categories={categories} />
    </div>
  )
}