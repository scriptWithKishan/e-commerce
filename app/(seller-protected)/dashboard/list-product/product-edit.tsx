"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  slug: string;
  stockQty: number;
}

interface ProductEditProps {
  product: Product;
}

// Helper Functions

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductEdit({ product }: ProductEditProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState<string | number>(product.price);
  const [salePrice, setSalePrice] = useState<string | number>(product.salePrice ?? "");
  const [slug, setSlug] = useState(product.slug);
  const [stockQty, setStockQty] = useState<string | number>(product.stockQty);
  const router = useRouter();

  const handleEdit = async () => {
    setEditing(true);
    try {
      const res = await fetch("/api/seller/product", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          name,
          description,
          price,
          salePrice,
          slug,
          stockQty,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to edit product");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setEditing(false);
    }
  };

  return (
    <>
      <button
        className="text-indigo-600 hover:text-indigo-900 cursor-pointer text-xs font-semibold uppercase tracking-wider transition-colors"
        onClick={() => setOpen(true)}
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200 animate-fade-in-up">
            <h3 className="text-base font-bold text-slate-900 mb-2 normal-case tracking-normal">Edit your Product</h3>
            <p className="text-slate-500 text-xs mb-6 normal-case tracking-normal leading-relaxed">
              Update your product details like name, description, price and stock 
            </p>
            <div className="space-y-4 my-6">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setSlug(slugify(e.target.value))
                  }}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="slug" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Slug</label>
                <input
                  type="text"
                  id="slug"
                  placeholder="product-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="description" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  id="description"
                  placeholder="Product Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50 resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="price" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Price</label>
                  <input
                    type="text"
                    id="price"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="salePrice" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Sale Price</label>
                  <input
                    type="text"
                    id="salePrice"
                    placeholder="Sale"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="stockQty" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Stock</label>
                  <input
                    type="text"
                    id="stockQty"
                    placeholder="Stock"
                    value={stockQty}
                    onChange={(e) => setStockQty(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50 hover:bg-slate-50"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-x-3">
              <button
                onClick={() => setOpen(false)}
                disabled={editing}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={editing}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {editing ? "Editing..." : "Edit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}