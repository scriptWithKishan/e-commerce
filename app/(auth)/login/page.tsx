"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { FcGoogle } from "react-icons/fc";

export default function Login () {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  }

  return (
    <>
      <form 
        className="flex flex-col gap-y-3 "
        onSubmit={handleSubmit}
      >
        <label className="text-black font-bold" htmlFor="loginEmail">Email</label>
        <input id="loginEmail" name="email" className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-black" type="email" placeholder="Enter your Email" />
        <label className="text-black font-bold" htmlFor="loginPassword">Password</label>
        <input id="loginPassword" name="password" className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-black" type="password" placeholder="Enter your Password" />
        <button
          className="group relative overflow-hidden rounded-lg bg-black px-6 py-3 font-semibold text-white cursor-pointer"
        >
          <span
            className="absolute inset-0 -translate-x-full bg-[#006A4E] transition-transform duration-300 group-hover:translate-x-0"
          ></span>

          <span className="relative">Login</span>
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p className="self-center m-4 text-black">or</p>
      <button
        className="bg-white text-black border-1 border-slate-300 flex items-center justify-center gap-x-2 px-6 py-3 rounded-lg cursor-pointer font-semibold hover:bg-black hover:text-white"
        onClick={() => {
          signIn("google", { callbackUrl: "/" })
        }}
      >
        <FcGoogle />
        Google
      </button>
    </>
  )
}
