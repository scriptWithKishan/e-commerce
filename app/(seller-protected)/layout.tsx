import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navbar from "../(components)/navbar";

export default async function SellerProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/register");
  }

  if (session.user.sellerStatus !== "APPROVED") {
    redirect("/settings/seller");
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      {children}
    </div>
  );
}
