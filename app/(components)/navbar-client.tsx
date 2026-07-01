"use client";

import { useState } from "react";

import Link from "next/link";
import { Session } from "next-auth";

import { Settings, ShoppingCart } from "lucide-react";
import Drawer from "./drawer";

export default function NavbarClient({ session }: {session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDrawer = () => {
    setIsOpen(false);
  }

  if (session) {
    return (
      <div className="flex items-center gap-x-4">
        <p className="text-black text-sm">{session.user?.email}</p>
        <button 
          className="group relative flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-md bg-black shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-500 hover:w-[100px] hover:shadow-none cursor-pointer"
          onClick={()=> {}}
        >
          <span
            className="absolute inset-0 rounded-md opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-black"
          />

          {/* Icon */}
          <ShoppingCart
            size={18}
            className="relative z-10 text-white transition-all duration-500 delay-200 group-hover:scale-0 group-hover:text-white group-hover:delay-0"
          />

          {/* Label */}
          <span className="absolute z-10 scale-0 text-xs uppercase text-white transition-all duration-500 group-hover:scale-100 group-hover:delay-200">
            Cart
          </span>
        </button>
        <button 
          className="group relative flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-md bg-black shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-500 hover:w-[100px] hover:shadow-none cursor-pointer"
          onClick={()=> setIsOpen(true)}
        >
          <span
            className="absolute inset-0 rounded-md opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-black"
          />

          {/* Icon */}
          <Settings
            size={18}
            className="relative z-10 text-white transition-all duration-500 delay-200 group-hover:scale-0 group-hover:text-white group-hover:delay-0"
          />

          {/* Label */}
          <span className="absolute z-10 scale-0 text-xs uppercase text-white transition-all duration-500 group-hover:scale-100 group-hover:delay-200">
            Settings
          </span>
        </button>
        <Drawer isOpen={isOpen} close={closeDrawer} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-x-4">
      <Link
        href="/login"
        className="text-black text-sm font-semibold hover:text-indigo-600"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors"
      >
        Register
      </Link>
    </div>
  )
}