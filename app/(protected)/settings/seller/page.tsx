import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SellerApplyForm from "@/app/(protected)/settings/seller/seller-apply-form";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-xl mx-auto flex-1 px-4 flex items-center justify-center">
      <SellerApplyForm initialStatus={session!.user.sellerStatus as "NONE" | "PENDING" | "APPROVED" | "REJECTED"} />
    </div>
  );
}