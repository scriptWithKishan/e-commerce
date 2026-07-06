"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

type ProductImage = {
  url: string;
  altText: string;
  isPrimary: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  images: ProductImage[];
  stockQty: number;
};

type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

interface CartItemProps {
  item: CartItem;
  onUpdate: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItemCard({ item, onUpdate, onRemove }: CartItemProps) {
  const [loading, setLoading] = useState(false);

  const product = item.product;
  const isOnSale = product.salePrice && product.salePrice < product.price;
  const price = isOnSale ? product.salePrice : product.price;
  const originalPrice = isOnSale ? product.price : null;
  const imageUrl = product.images?.[0]?.url || "/placeholder.png";

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > product.stockQty || loading) return;

    setLoading(true);
    await onUpdate(item.id, newQuantity);
    setLoading(false);
  };

  const handleRemove = async () => {
    if (loading) return;
    setLoading(true);
    await onRemove(item.id);
  };

  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Product Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {product.stockQty > 0 ? `${product.stockQty} in stock` : "Out of stock"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">
              ₹{price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={14} />
            </button>

            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= product.stockQty || loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
            </button>

            <button
              onClick={handleRemove}
              disabled={loading}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Item Total */}
      <div className="flex flex-col items-end justify-between">
        <span className="text-lg font-bold text-slate-900">
          ₹{(price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
