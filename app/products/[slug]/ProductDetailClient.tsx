"use client";

import Image from "next/image";
import { useState } from "react";
import { SerializedProductWithCategory } from "@/types/product";
import Link from "next/link";

interface ProductDetailClientProps {
  product: SerializedProductWithCategory;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const images = product.images as Array<{ url: string; altText: string; isPrimary: boolean }>;
  const [selectedImage, setSelectedImage] = useState(0);

  const currentImage = images?.[selectedImage] || { url: "/placeholder.png", altText: product.name, isPrimary: true };
  const isOnSale = product.salePrice && product.salePrice < product.price;
  const discountPercent = isOnSale
    ? Math.round((1 - product.salePrice! / product.price) * 100)
    : 0;
  const inStock = product.stockQty > 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`} className="hover:text-slate-900 transition-colors">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-900">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Images */}
          <div className="flex gap-4">
            {/* Thumbnail List */}
            <div className="flex w-20 flex-col gap-3">
              {images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                    selectedImage === index
                      ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2"
                      : "border-transparent hover:border-slate-300"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 aspect-square overflow-hidden rounded-2xl bg-white">
              <Image
                src={currentImage.url}
                alt={currentImage.altText || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {isOnSale && (
                <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            {product.category && (
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                {product.category.name}
              </span>
            )}

            {/* Name */}
            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">
                {isOnSale ? `$${product.salePrice!.toFixed(2)}` : `$${product.price.toFixed(2)}`}
              </span>
              {isOnSale && (
                <span className="text-xl text-slate-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-4 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm text-slate-600">
                {inStock ? `${product.stockQty} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                Description
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                  Tags
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="mt-auto pt-10">
              <button
                disabled={!inStock}
                className={`w-full rounded-xl py-4 text-base font-semibold transition-all ${
                  inStock
                    ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}