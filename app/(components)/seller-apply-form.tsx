"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type SellerStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

export default function SellerApplyForm({ initialStatus }: { initialStatus: SellerStatus }) {
  const [status, setStatus] = useState<SellerStatus>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const successParam = searchParams.get("success");
  const errorParam = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const form = e.currentTarget;
    const shopName = (form.elements.namedItem("shopName") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;

    const res = await fetch("/api/seller/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopName, phone }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("PENDING");
      setMessage(data.message);
    } else {
      setError(data.error);
    }

    setLoading(false);
  }

  if (status === "APPROVED") {
    return (
      <div className="border border-slate-200 rounded-xl p-6 text-center">
        <h2 className="text-lg font-bold text-black mb-1">You&apos;re now a seller!</h2>
        <p className="text-slate-500 text-sm mb-4">
          Your seller account has been approved. You can manage your shop from the seller dashboard.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="border border-slate-200 rounded-xl p-6 text-center">
        <h2 className="text-lg font-bold text-black mb-1">Application Submitted</h2>
        <p className="text-slate-500 text-sm mb-4">
          {message || "Check your email to verify your seller account. The verification link expires in 24 hours."}
        </p>
        {errorParam === "token-expired" && (
          <p className="text-red-500 text-sm mb-4">
            ❌ Verification link expired. Please contact support to resend.
          </p>
        )}
        {errorParam === "invalid-token" && (
          <p className="text-red-500 text-sm mb-4">
            ❌ Invalid verification link.
          </p>
        )}
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="border border-slate-200 rounded-xl p-6 text-center">
        <h2 className="text-lg font-bold text-black mb-1">Application Not Approved</h2>
        <p className="text-slate-500 text-sm mb-4">
          Your seller application was not approved. If you think this is a mistake, please contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-xl p-6">
      <h2 className="text-lg font-bold text-black mb-1">Become a Seller</h2>
      <p className="text-slate-500 text-sm mb-4">
        Fill out the form below. We&apos;ll send a verification email to confirm.
      </p>

      {successParam === "seller-approved" && (
        <p className="text-green-600 text-sm mb-4">
          ✅ Your seller account has been approved! You can now access the seller dashboard.
        </p>
      )}
      {errorParam === "token-expired" && (
        <p className="text-red-500 text-sm mb-4">
          ❌ Verification link expired. Please apply again.
        </p>
      )}
      {errorParam === "invalid-token" && (
        <p className="text-red-500 text-sm mb-4">
          ❌ Invalid verification link.
        </p>
      )}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
        <label className="text-black font-bold text-sm" htmlFor="shopName">Shop Name</label>
        <input
          id="shopName" name="shopName" type="text"
          placeholder="Enter your shop name"
          disabled={loading}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 disabled:opacity-50"
        />
        <label className="text-black font-bold text-sm" htmlFor="phone">Phone</label>
        <input
          id="phone" name="phone" type="tel"
          placeholder="Enter your phone number"
          disabled={loading}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-black focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 disabled:opacity-50"
        />
        <button
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Submitting..." : "Apply to Become a Seller"}
        </button>
      </form>
    </div>
  );
}
