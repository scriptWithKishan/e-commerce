import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { sendSellerVerificationEmail } from "@/lib/email";
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shopName, phone } = await req.json();

    if (!shopName || !phone) {
      return NextResponse.json(
        { error: "Shop name and phone are required!" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { sellerApplication: true }
    });

    if (user?.sellerStatus !== "NONE") {
      return NextResponse.json(
        { error: "You have already applied!" },
        { status: 400 }
      )
    }

    // Save application
    await prisma.sellerApplication.create({
      data: { userId: session.user.id, shopName, phone },
    });

    // Update status to pending
    await prisma.user.update({
      where: { id: session.user.id },
      data: { sellerStatus: "PENDING" }
    });

    // Generate Verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: session.user.email!,
        token,
        expires,
      },
    });

    await sendSellerVerificationEmail(session.user.email!, token);

    return NextResponse.json(
      { message: "Application submitted! Please check your email to verify" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seller apply error: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}