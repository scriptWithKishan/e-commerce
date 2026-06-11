"use client"

import { usePathname, useRouter } from "next/navigation"

export default function Layout ({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const router = useRouter();

  const path = pathname.includes("login") ? "login" : "register";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#FFFDF2_0%,_#FFF8E8_45%,_#F6EFD0_100%)] flex flex-col items-center justify-center" >

      {/* Pill to control the login and register */}
      <div className="relative flex w-50 rounded-full bg-transparent border-black border-1 p-1 mb-2">
        {/* Animated Background */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)]
            rounded-full bg-black transition-all duration-300 ease-out
            ${path === "register" ? "left-1" : "left-1/2"}`}
        />

        <button
          onClick={() => router.push("/register")}
          className={`relative z-10 font-semibold flex-1 py-2 cursor-pointer font-medium transition-colors duration-300
            ${path === "register" ? "text-white" : "text-black"}`}
        >
          Register
        </button>

        <button
          onClick={() => router.push("/login")}
          className={`relative z-10 flex-1 py-2 font-semibold cursor-pointer font-medium transition-colors duration-300
            ${path === "login" ? "text-white" : "text-black"}`}
        >
          Login
        </button>
      </div>

      {/* Login or Register Card */}
      <div className="w-150 flex flex-col rounded-2xl shadow-lg border-0 p-8 bg-white">
        <h1 className="text-black text-2xl font-extrabold mb-2">{path === "login" ? "Login" : "Create Your Account"}</h1>
        <p className="text-black font-semibold mb-4">{path === "login" ? "Access your account and continue where you left off" : "Everything starts with a single step."}</p>
        {children}
      </div>
    </div>
  )
} 