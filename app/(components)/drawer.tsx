"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

interface DrawerProps {
  isOpen: boolean;
  close: () => void;
}

export default function Drawer({ isOpen, close }: DrawerProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const sellerStatus = session?.user?.sellerStatus;
  const isSeller = role === "SELLER" || sellerStatus === "APPROVED";

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />
      <div
        className={`fixed top-0 right-0 h-full w-90 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-2 gap-y-2">
          <button
            className="self-start bg-black text-white rounded-md p-1 cursor-pointer"
            onClick={close}
          >
            <X size={20} />
          </button>
          <h1 className="text-center text-2xl font-bold text-black">Settings</h1>

          <div className="h-full flex flex-col justify-between">
            <div className="mt-6 text-black w-full flex flex-col">
              {isSeller ? (
                <Link
                  href="/dashboard"
                  className="w-full p-4 block font-bold hover:bg-black hover:text-white"
                >
                  Seller Dashboard
                </Link>
              ) : (
                <Link
                  href="/settings/seller"
                  className="w-full p-4 block font-bold hover:bg-black hover:text-white"
                >
                  Become Seller
                </Link>
              )}
            </div>
            <button onClick={()=> signOut({callbackUrl: "/login"})} className="w-full p-4 block font-bold text-black hover:bg-red-600 hover:text-white cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 