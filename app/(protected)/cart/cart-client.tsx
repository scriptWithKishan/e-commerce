"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import CartItemCard from "./cart-item";

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

type Cart = {
  id: string;
  items: CartItem[];
};

interface CartClientProps {
  initialCart: Cart | null;
}

export default function CartClient({ initialCart }: CartClientProps) {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [loading, setLoading] = useState(false);

  const updateItem = async (itemId: string, quantity: number) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.map((item) =>
              item.id === itemId ? { ...item, quantity: data.item.quantity } : item
            ),
          };
        });
      }
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCart((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.filter((item) => item.id !== itemId),
          };
        });
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const clearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/cart", { method: "DELETE" });
      if (res.ok) {
        setCart({ id: cart?.id || "", items: [] });
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
    setLoading(false);
  };

  // Calculate totals
  const subtotal = cart?.items.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + price * item.quantity;
  }, 0) || 0;

  const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-slate-100 p-6">
          <ShoppingBag size={48} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Your cart is empty</h2>
        <p className="mt-2 text-slate-500">Looks like you haven't added anything to your cart yet.</p>
        <a
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">{totalItems} item{totalItems !== 1 ? "s" : ""} in your cart</p>
            <button
              onClick={clearCart}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={14} />
              Clear
            </button>
          </div>

          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="space-y-3">
                {cart.items.map((item) => {
                  const price = item.product.salePrice || item.product.price;
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600 line-clamp-1 flex-1 pr-2">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-medium">₹{(price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              className="mt-6 w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Proceed to Checkout
            </button>

            <a
              href="/"
              className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              <ArrowLeft size={14} />
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
