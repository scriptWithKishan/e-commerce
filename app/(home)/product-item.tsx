"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductItemProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    salePrice: number | null;
    stockQty: number;
    images: Array<{ url: string; altText: string; isPrimary: boolean }>;
    tags: string[];
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
}

export default function ProductItem({ product }: ProductItemProps) {
  const router = useRouter();

  const images = product.images as Array<{ url: string; altText: string; isPrimary: boolean }>;
  const primaryImage = images?.find((img) => img.isPrimary) || images?.[0];
  const imageUrl = primaryImage?.url || "/placeholder.png";
  const isOnSale = product.salePrice && Number(product.salePrice) < Number(product.price);
  const discountPercent = isOnSale
    ? Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100)
    : 0;

  const inStock = product.stockQty > 0;

  const addToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const res = await fetch('/api/cart',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: product.id,
        quantity: 1,
      }),
    });
    
  }

  return (
    <div
      onClick={() => router.push(`/products/${product.slug}`)}
      className="group relative flex h-[370px] w-full max-w-[330px] mx-auto flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-md"
    >
      {/* Image Container */}
      <div className="relative h-[250px] w-full flex-shrink-0 overflow-hidden bg-slate-50">
        <Image
          src={imageUrl}
          alt={primaryImage?.altText || product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Sale Badge */}
        {isOnSale && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
            -{discountPercent}%
          </span>
        )}

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
              Out of Stock
            </span>
          </div>
        )}

        {/* Add to Cart - Slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <button 
            className="w-full bg-slate-900 py-3.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
            onClick={addToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-3">
        {/* Category */}
        {product.category && (
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {product.category.name}
          </span>
        )}

        {/* Name */}
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900 leading-snug">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-lg font-bold text-slate-900">
            {isOnSale ? `₹${Number(product.salePrice).toFixed(2)}` : `₹${Number(product.price).toFixed(2)}`}
          </span>
          {isOnSale && (
            <span className="text-sm text-slate-400 line-through">
              ₹${Number(product.price).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
