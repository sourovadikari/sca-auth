import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import {
  generateToken,
  generateTokenExpiry,
  isTokenExpired,
} from "@/utils/token";
import { sendEmail } from "@/lib/mailer";
import { passwordResetTemplate } from "@/templates/passwordReset";

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();

    if (!identifier || typeof identifier !== "string") {
      return NextResponse.json(
        { error: "Email or username is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const cleanId = identifier.toLowerCase().trim();

    // 🔍 Find user by email OR username
    const user = await User.findOne({
      $or: [{ email: cleanId }, { username: cleanId }],
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // ✅ If user is not verified, verify them now (optional, but recommended)
    if (!user.emailVerified) {
      user.emailVerified = true;
    }

    // 🧩 Check if token already exists and is still valid
    const tokenIsExpired =
      !user.verificationToken ||
      !user.verificationTokenExpiry ||
      isTokenExpired(user.verificationTokenExpiry);

    let message = "";

    if (tokenIsExpired || user.verificationTokenPurpose !== "password-reset") {
      // ⏰ Generate a new token and expiry (5 minutes)
      const newToken = generateToken();
      const newExpiry = generateTokenExpiry(5);

      user.verificationToken = newToken;
      user.verificationTokenExpiry = newExpiry;
      user.verificationTokenPurpose = "password-reset";

      await user.save();

      // Compose reset URL
      const resetUrl = `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/new-password?email=${encodeURIComponent(
        user.email
      )}&token=${encodeURIComponent(newToken)}`;

      // Send email
      try {
        await sendEmail({
          to: user.email,
          subject: "Reset Your Password",
          html: passwordResetTemplate(user.fullName || user.email, resetUrl),
        });
      } catch (err) {
        console.error("Failed to send password reset email:", err);
      }

      message =
        "✅ A new password reset link has been sent to your email. Please check your inbox.";
    } else {
      // Token still valid, no need to generate new one
      message =
        "🕓 A password reset link has already been sent earlier. Please check your inbox.";
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
