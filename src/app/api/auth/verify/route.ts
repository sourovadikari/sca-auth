import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { isTokenExpired } from "@/utils/token";
import { sendEmail } from "@/lib/mailer";
import { emailVerifiedTemplate } from "@/templates/verificationConfirmed";

export async function GET(req: Request) {
  let response = { message: "", error: "" };
  let status = 200;

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase().trim();
    const token = searchParams.get("token");

    if (!email || !token) {
      response.error = "Email and verification token are required.";
      status = 400;
      return NextResponse.json(response, { status });
    }

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      response.error = "User not found.";
      status = 404;
    } else if (
      user.verificationToken !== token ||
      !user.verificationTokenExpiry ||
      isTokenExpired(user.verificationTokenExpiry) ||
      user.verificationTokenPurpose !== "signup"
    ) {
      response.error = "Invalid or expired verification token.";
      status = 400;
    } else {
      Object.assign(user, {
        emailVerified: true,
        verificationToken: undefined,
        verificationTokenExpiry: undefined,
        verificationTokenPurpose: undefined,
      });
      await user.save();

      await sendEmail({
        to: user.email,
        subject: "Your Email is Now Verified",
        html: emailVerifiedTemplate(user.username || user.email),
      }).catch((err) =>
        console.error("Verification confirmation email failed:", err)
      );

      response.message = "Email successfully verified.";
      status = 200;
    }
  } catch (err) {
    console.error("Verification error:", err);
    response.error = "Internal server error.";
    status = 500;
  }

  return NextResponse.json(response, { status });
}
