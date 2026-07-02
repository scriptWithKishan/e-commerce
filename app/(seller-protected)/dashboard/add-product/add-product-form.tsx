"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState, useCallback, useRef } from "react";

// Types

interface ImageItem {
  file: File;
  previewUrl: string;
  uploaded?: boolean;
  cloudUrl?: string;
}

interface Category {
  id: string;
  name: string;
}

interface ProductPayload {
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  stockQty: number;
  categoryId: string | null;
  tags: string[];
  images: { url: string; altText: string; isPrimary: boolean }[];
}

interface AddProductFormProps {
  categories?: Category[];
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

async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars not set");
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", uploadPreset);
  fd.append("folder", "products");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: fd }
  );

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.secure_url as string;
}

// Validations
interface FormErrors {
  name?: string;
  slug?: string;
  description?: string;
  price?: string;
  salePrice?: string;
  stockQty?: string;
}

function validate(fields: {
  name: string;
  slug: string;
  description: string;
  price: string;
  salePrice: string;
  stockQty: string;
}): FormErrors {
  const errors: FormErrors = {};
  if (!fields.name.trim()) errors.name = "Product name is required";
  else if (!/^[a-z0-9-]+$/.test(fields.slug))
    errors.slug = "Only lowercase letters, numbers, and hyphens";
  if (!fields.description.trim())
    errors.description = "Description is required";
  if (!fields.price) errors.price = "Price is required";
  else if (isNaN(Number(fields.price)) || Number(fields.price) < 0)
    errors.price = "Enter a valid price";
  if (
    fields.salePrice &&
    (isNaN(Number(fields.salePrice)) || Number(fields.salePrice) < 0)
  )
    errors.salePrice = "Enter a valid sale price";
  if (
    fields.salePrice &&
    fields.price &&
    Number(fields.salePrice) >= Number(fields.price)
  )
    errors.salePrice = "Sale price must be less than original price";
  if (!fields.stockQty) errors.stockQty = "Stock quantity is required";
  else if (
    isNaN(Number(fields.stockQty)) ||
    !Number.isInteger(Number(fields.stockQty)) ||
    Number(fields.stockQty) < 0
  )
    errors.stockQty = "Enter a valid whole number";
  return errors;
}

// Component

export default function AddProductForm({ categories = [] }: AddProductFormProps) {
  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);

  // UI state
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Slug auto generation

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  function handleSlugChange(value: string) {
    setSlug(slugify(value));
    setSlugEdited(true);
  }

  // Tags

  function addTag() {
    const val = tagInput.trim().toLowerCase();
    if (!val || tags.includes(val)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, val]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  // Images

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newItems: ImageItem[] = files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newItems]);
      // reset input so same file can be re-added after removal
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    []
  );

  function removeImage(index: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    const newItems: ImageItem[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newItems]);
  }

  // Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const fieldErrors = validate({ name, slug, description, price, salePrice, stockQty });
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      // 1. Upload images to Cloudinary
      const uploadedImages = await Promise.all(
        images.map(async (img, i) => {
          const url = await uploadToCloudinary(img.file);
          return { url, altText: img.file.name, isPrimary: i === 0 };
        })
      );

      // 2. POST product to API
      const payload: ProductPayload = {
        name,
        slug,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stockQty: parseInt(stockQty, 10),
        categoryId: categoryId || null,
        tags,
        images: uploadedImages,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus({ type: "success", message: "Product added successfully!" });

      // Reset form
      setName(""); setSlug(""); setSlugEdited(false);
      setDescription(""); setPrice(""); setSalePrice("");
      setStockQty(""); setCategoryId(""); setTags([]);
      setImages([]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setStatus({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  }

  // Render

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col items-center gap-y-6 mt-10">

      {/* Basic info */}
      <section className="flex flex-col p-6 w-200 text-black shadow-md rounded-lg gap-y-6">
        <h3 className="text-xl font-semibold">Basic info</h3>

        <div className="flex flex-col gap-y-1">
          <label htmlFor="text-base">Product name <span className="text-red-500">*</span></label>
          <input
            id="apf-name"
            className="text-base border border-gray-300 rounded-md px-3 py-2 outline-none"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Classic White Sneakers"
            aria-describedby={errors.name ? "apf-name-err" : undefined}
          />
          {errors.name && <p className="text-xs text-red-500" id="apf-name-err">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-y-1">
          <label htmlFor="text-base">
            Slug <span className="text-red-500">*</span>
            <span className="text-xs ml-2 text-gray-500">Used in the product URL</span>
          </label>
          <input
            id="apf-slug"
            type="text"
            className="text-base border border-gray-300 rounded-md px-3 py-2 outline-none"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="classic-white-sneakers"
            aria-describedby={errors.slug ? "apf-slug-err" : undefined}
          />
          {errors.slug && <p className="text-xs text-red-500" id="apf-slug-err">{errors.slug}</p>}
        </div>

        <div className="flex flex-col gap-y-1">
          <label htmlFor="text-base">Description <span className="text-red-500">*</span></label>
          <textarea
            id="apf-desc"
            value={description}
            className="text-base border border-gray-300 rounded-md px-3 py-2 outline-none"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product…"
            rows={3}
            aria-describedby={errors.description ? "apf-desc-err" : undefined}
          />
          {errors.description && <p className="text-xs text-red-500" id="apf-desc-err">{errors.description}</p>}
        </div>
      </section>

      {/* Pricing & stock */}
      <section className="flex flex-col p-6 w-200 text-black shadow-md rounded-lg gap-y-6">
        <h3 className="text-xl font-semibold">Pricing & stock</h3>
        <div className="flex items-center jusify-between gap-x-4">
          <div className="flex flex-col gap-y-1">
            <label htmlFor="apf-price">Price (₹) <span className="text-red-500">*</span></label>
            <input
              id="apf-price"
              type="number"
              className="text-base border border-gray-300 rounded-md px-3 py-2 outline-none"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="999.00"
              min="0"
              step="0.01"
              aria-describedby={errors.price ? "apf-price-err" : undefined}
            />
            {errors.price && <p className="text-xs text-red-500" id="apf-price-err">{errors.price}</p>}
          </div>

          <div className="flex flex-col gap-y-1">
            <label htmlFor="apf-sale">
              Sale price (₹)
              <span className="text-gray-500 ml-2 text-xs">Optional</span>
            </label>
            <input
              id="apf-sale"
              type="number"
              className="text-base border border-gray-300 rounded-md px-3 py-2 outline-none"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="799.00"
              min="0"
              step="0.01"
              aria-describedby={errors.salePrice ? "apf-sale-err" : undefined}
            />
            {errors.salePrice && <p className="text-xs text-red-500" id="apf-sale-err">{errors.salePrice}</p>}
          </div>

          <div className="flex flex-col gap-y-1">
            <label htmlFor="apf-stock">Stock qty <span className="text-red-500">*</span></label>
            <input
              id="apf-stock"
              type="number"
              className="text-base border border-gray-300 rounded-md px-3 py-2 outline-none"
              value={stockQty}
              onChange={(e) => setStockQty(e.target.value)}
              placeholder="50"
              min="0"
              step="1"
              aria-describedby={errors.stockQty ? "apf-stock-err" : undefined}
            />
            {errors.stockQty && <p className="text-xs text-red-500" id="apf-stock-err">{errors.stockQty}</p>}
          </div>
        </div>
      </section>

      {/* Category & tags */}
      <section className="flex flex-col p-6 w-200 text-black shadow-md rounded-lg gap-y-6">
        <h3 className="text-xl font-semibold">Category & tags</h3>

        <div className="flex flex-col gap-y-1">
          <label htmlFor="apf-cat">Category</label>
          <select
            id="apf-cat"
            className="text-base border border-gray-300 rounded-md px-3 py-2 outline-none"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-y-1">
          <label htmlFor="apf-tag-input">Tags</label>
          <div className="flex items-center gap-x-2">
            <input
              id="apf-tag-input"
              type="text"
              className="text-base border border-gray-300 rounded-md px-3 py-2 outline-none"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addTag(); }
              }}
              placeholder="Type a tag and press Enter"
            />
            <button type="button" className="bg-black text-white rounded-md px-3 py-2 cursor-pointer" onClick={addTag}>
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex items-center gap-x-2">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10s">
                  {tag}
                  <button
                    type="button"
                    className="ml-1.5 inline-flex items-center justify-center rounded-full bg-blue-600 p-0.5 text-blue-200 hover:bg-blue-500 hover:text-white focus:z-20 focus:outline-offset-2 focus:outline-blue-600 cursor-pointer"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove tag ${tag}`}
                  >
                    <span className="h-3.5 w-3.5 flex items-center justify-center text-white">
                      <X size={10} />
                    </span>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Images */}
      <section className="flex flex-col p-6 w-200 text-black shadow-md rounded-lg gap-y-6">
        <h3 className="text-xl font-semibold">Images</h3>
        <div
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          aria-label="Upload product images"
        >
          <span className="text-4xl mb-2">↑</span>
          <p>Drag images here or <span className="text-blue-600 underline">browse files</span></p>
          <p className="text-sm text-gray-500 mt-1">PNG, JPG, WebP — first image is set as primary</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {images.map((img, i) => (
              <div key={img.previewUrl} className="relative rounded-md overflow-hidden border border-gray-300">
                <Image
                  src={img.previewUrl}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-32 object-cover"
                />
                {i === 0 && <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs">Primary</span>}
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                  aria-label={`Remove image ${i + 1}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      {status && (
        <p className={`apf-status apf-status--${status.type}`}>
          {status.message}
        </p>
      )}

      <div className="flex justify-end w-200">
        <button type="submit" className="bg-black text-white font-semibold rounded-md py-2 px-3 disabled:opacity-50 cursor-pointer" disabled={submitting}>
          {submitting ? "Saving…" : "Save product"}
        </button>
      </div>
    </form>
  )
}