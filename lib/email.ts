import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
});

export async function sendSellerVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/seller/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your Seller Application",
    html: `
      <h2>You applied to become a seller!</h2>
      <p>Click the button below to verify your email and complete your application.</p>
      <a href="${verifyUrl}" style="background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
        Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
    `
  })
}