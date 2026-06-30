"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageDisplayProps {
  images: { url: string; altText: string; isPrimary: boolean }[];
  primaryImage: { url: string; altText: string; isPrimary: boolean } | undefined;
  isOnSale: boolean;
  discountPercent: number;
  inStock: boolean;
  productName: string;
}


export default function ImageDisplay({
  images,
  primaryImage,
  isOnSale,
  discountPercent,
  inStock,
  productName,
}: ImageDisplayProps) {
  
  const [selectedImage, setSelectedImage] = useState(primaryImage)
  
  return (
    <>
    {/* Left Column - Image Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex flex-col gap-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                      image.url === selectedImage?.url
                        ? "border-slate-900"
                        : "border-transparent hover:border-slate-300"
                    }`}

                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${productName} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-white shadow-sm">
              <Image
                src={selectedImage?.url || "/placeholder.png"}
                alt={selectedImage?.altText || productName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Sale Badge */}
              {isOnSale && (
                <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white">
                  -{discountPercent}%
                </span>
              )}

              {/* Out of Stock Overlay */}
              {!inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <span className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>
    </>
  )
}