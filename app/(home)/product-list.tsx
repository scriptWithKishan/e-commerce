import { prisma } from "@/lib/prisma";
import ProductItem from "./product-item";

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
  limit?: number;
  categorySlug?: string;
}

export default async function ProductList({ limit, categorySlug }: ProductListProps) {
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

  let whereClause = {};

  if (categorySlug) {
    // Get the category
    const selectedCategory = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (selectedCategory) {
      // Get all nested children (2nd level, 3rd level, etc.)
      const childIds = await getAllChildren(selectedCategory.id);

      // Get all category IDs (selected category + all nested children)
      const categoryIds = [selectedCategory.id, ...childIds];

      whereClause = {
        categoryId: { in: categoryIds },
      };
    }
  }

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

  const productData: Product[] = products.map((product) => ({
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


  if (productData.length === 0) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center py-16 text-center">
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
        {productData.map((product, index) => (
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
