"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductDelete from "./product-delete";
import ProductEdit from "./product-edit";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  slug: string;
  stockQty: number;
  category: {
    name: string;
  } | null;
}

export default function ProductTable({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleSelectAll = () => {
    if (selected.length < products.length) {
      setSelected(products.map((product) => product.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (productId: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleBulkDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/seller/product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds: selected }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete products");
      }

      setOpenDeleteConfirm(false);
      setSelected([]);
      router.refresh();
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete products");
    } finally {
      setDeleting(false);
    }
  };

  const isSelectedAll = products.length > 0 && selected.length === products.length;

  return (
    <div className="w-[80%] flex flex-col gap-y-4">
      {/* Bulk actions bar */}
      <div
        className={`flex items-center justify-between px-6 py-3 bg-white border border-slate-100 rounded-xl shadow-sm transition-all duration-300 ${
          selected.length > 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="text-sm text-slate-600 font-medium">
          Selected <span className="text-indigo-600 font-semibold">{selected.length}</span>{" "}
          {selected.length === 1 ? "product" : "products"}
        </div>
        <button
          onClick={() => setOpenDeleteConfirm(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer flex items-center gap-x-2"
        >
          Delete Selected
        </button>
      </div>

      <table className="w-full border-separate border-spacing-x-0 bg-slate-50/60 p-2 rounded-sm text-slate-800">
        <thead>
          <tr className="text-slate-700 text-xs font-semibold uppercase tracking-wider">
            <th className="bg-slate-100/80 rounded-l-sm text-center py-2 px-2 w-12">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={isSelectedAll}
                className="w-4.5 h-4.5 mx-auto rounded bg-slate-200 appearance-none cursor-pointer flex items-center justify-center checked:bg-indigo-600 after:content-['✓'] after:text-white after:text-[10px] after:font-bold after:hidden checked:after:block"
              />
            </th>
            <th className="bg-slate-100/80 py-2 px-6 text-center">Name</th>
            <th className="bg-slate-100/80 py-2 px-6 text-center">Category</th>
            <th className="bg-slate-100/80 py-2 px-6 text-center">Price</th>
            <th className="bg-slate-100/80 py-2 px-6 text-center">Stock</th>
            <th className="bg-slate-100/80 py-2 px-6 rounded-r-sm text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="text-xs uppercase tracking-wider">
              <td className="rounded-l-sm text-center py-2 px-2 w-12">
                <input
                  type="checkbox"
                  onChange={() => handleSelect(product.id)}
                  checked={selected.includes(product.id)}
                  className="w-4 h-4 mx-auto rounded bg-slate-200 appearance-none cursor-pointer flex items-center justify-center checked:bg-indigo-600 after:content-['✓'] after:text-white after:text-[10px] after:font-bold after:hidden checked:after:block"
                />
              </td>
              <td className="py-2 px-6 text-left truncate max-w-[300px]">{product.name}</td>
              <td className="py-2 px-6 text-center">{product.category ? product.category.name : "N/A"}</td>
              <td className="py-2 px-6 text-center">{Number(product.price).toFixed(2)}₹</td>
              <td className="py-2 px-6 text-center">{product.stockQty}</td>
              <td className="py-2 px-6 rounded-r-sm text-left flex items-center gap-x-2">
                <ProductEdit
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: Number(product.price),
                    salePrice: product.salePrice ? Number(product.salePrice) : null,
                    slug: product.slug,
                    stockQty: product.stockQty,
                  }}
                />
                <ProductDelete productId={product.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bulk Delete Confirmation Modal */}
      {openDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 max-w-sm w-full rounded-xl p-6 shadow-2xl border border-slate-200 animate-fade-in-up">
            <h3 className="text-base font-bold text-slate-900 mb-2 normal-case tracking-normal">
              Delete Selected Products?
            </h3>
            <p className="text-slate-500 text-xs mb-6 normal-case tracking-normal leading-relaxed">
              Are you sure you want to permanently delete the{" "}
              <span className="font-semibold text-slate-800">{selected.length}</span> selected products? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-x-3">
              <button
                onClick={() => setOpenDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}