"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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

interface ProductListClientProps {
  initialProducts: Product[];
  hasMore: boolean;
  categorySlug?: string;
}

export default function ProductListClient({
  initialProducts,
  hasMore,
  categorySlug,
}: ProductListClientProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMoreState, setHasMoreState] = useState(hasMore);

  const loadMore = async () => {
    if (loading || !hasMoreState) return;

    setLoading(true);

    // Build query params for API
    const params = new URLSearchParams();
    params.set("cursor", products[products.length - 1].id);
    params.set("pageSize", "8");
    
    if (categorySlug) params.set("categorySlug", categorySlug);
    if (searchParams.get("sort")) params.set("sort", searchParams.get("sort")!);
    if (searchParams.get("minPrice")) params.set("minPrice", searchParams.get("minPrice")!);
    if (searchParams.get("maxPrice")) params.set("maxPrice", searchParams.get("maxPrice")!);
    if (searchParams.get("inStock")) params.set("inStock", "true");

    const response = await fetch(`/api/products?${params.toString()}`);
    const data = await response.json();

    if (data.products && data.products.length > 0) {
      setProducts((prev) => [...prev, ...data.products]);
      setHasMoreState(data.hasMore);
    } else {
      setHasMoreState(false);
    }

    setLoading(false);
  };

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-slate-100 p-4">
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
        <h3 className="mb-1 text-lg font-semibold text-slate-900">
          No products found
        </h3>
        <p className="text-sm text-slate-500">
          Check back later for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${(index % 8) * 50}ms` }}
          >
            <ProductItem product={product} />
          </div>
        ))}
      </div>

      {hasMoreState && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-8 rounded-lg bg-slate-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
