import { prisma } from "@/lib/prisma";
import ProductItem from "./product-item";
import { SerializedProductWithCategory } from "@/types/product";

interface ProductListProps {
  limit?: number;
  categorySlug?: string;
}

export default async function ProductList({ limit, categorySlug }: ProductListProps) {
  const whereClause = categorySlug
    ? { category: { slug: categorySlug } }
    : {};

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedProducts: SerializedProductWithCategory[] = products.map((product) => ({
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: product.category
      ? {
          ...product.category,
          createdAt: product.category.createdAt.toISOString(),
          updatedAt: product.category.updatedAt.toISOString(),
        }
      : null,
  }));


  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-slate-100 dark:bg-zinc-800 p-4">
          <svg
            className="h-8 w-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-zinc-100">
          No products found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Check back later for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {serializedProducts.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ProductItem product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
