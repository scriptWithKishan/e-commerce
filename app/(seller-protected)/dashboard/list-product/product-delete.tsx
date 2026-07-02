"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductDeleteProps {
  productId: string;
}

export default function ProductDelete({ productId }: ProductDeleteProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/seller/product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds: [productId] }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        className="text-red-600 hover:text-red-900 cursor-pointer text-xs font-semibold uppercase tracking-wider transition-colors"
        onClick={() => setOpen(true)}
      >
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 max-w-sm w-full rounded-xl p-6 shadow-2xl border border-slate-200 animate-fade-in-up">
            <h3 className="text-base font-bold text-slate-900 mb-2 normal-case tracking-normal">Delete Product?</h3>
            <p className="text-slate-500 text-xs mb-6 normal-case tracking-normal leading-relaxed">
              Are you sure you want to permanently delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-x-3">
              <button
                onClick={() => setOpen(false)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}