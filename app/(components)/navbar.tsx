import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import NavbarClient from "./navbar-client";

import { Poppins } from 'next/font/google';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
});

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="w-full flex items-center justify-between shadow-md px-8 py-4 border-b border-slate-200 bg-white">
      <Link href="/" className="font-bold text-xl text-black">
        <h1 className={`${poppins.className} text-4xl font-bold`}>
          Sellio
        </h1>
      </Link>

      <NavbarClient session={session} />
    </nav>
  );
}