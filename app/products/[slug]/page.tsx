import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ImageDisplay from "../image-display";

// Simple types - no complex generics
type ProductImage = {
  url: string;
  altText: string;
  isPrimary: boolean;
};

type Category = {
  id: string;
  name: string;
  slug: string;
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
  category: Category | null;
  createdAt: Date;
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  // Transform Prisma data to simple types
  const productData: Product = {
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
    createdAt: product.createdAt,
  };

  const images = productData.images || [];
  const primaryImage = images.find((img) => img.isPrimary) || images[0];
  const isOnSale = !!(productData.salePrice && productData.salePrice < productData.price);
  const discountPercent = isOnSale
    ? Math.round((1 - productData.salePrice! / productData.price) * 100)
    : 0;
  const inStock = productData.stockQty > 0;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          {productData.category && (
            <>
              <Link
                href={`/category/${productData.category.slug}`}
                className="hover:text-slate-900 transition-colors"
              >
                {productData.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-900">{productData.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          <ImageDisplay images={images} primaryImage={primaryImage} isOnSale={isOnSale} discountPercent={discountPercent} inStock={inStock} productName={productData.name} /> 

          {/* Right Column - Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            {productData.category && (
              <span className="text-sm font-medium uppercase tracking-wide text-slate-500">
                {productData.category.name}
              </span>
            )}

            {/* Name */}
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {productData.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">
                {isOnSale
                  ? `₹${productData.salePrice?.toFixed(2)}`
                  : `₹${productData.price.toFixed(2)}`}
              </span>
              {isOnSale && (
                <span className="text-xl text-slate-400 line-through">
                  ₹{productData.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-6 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  inStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-slate-600">
                {inStock
                  ? `${productData.stockQty} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                Description
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600">
                {productData.description}
              </p>
            </div>

            {/* Tags */}
            {productData.tags.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                  Tags
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {productData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="mt-auto pt-8">
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