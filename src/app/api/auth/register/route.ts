import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { generateToken, generateTokenExpiry } from "@/utils/token";
import { sendEmail } from "@/lib/mailer";
import { emailVerificationTemplate } from "@/templates/emailVerification";

export async function POST(req: Request) {
  let response = { message: "", error: "" };
  let status = 200;

  try {
    const { fullName, email, username, password } = await req.json();
    if (![fullName, email, username, password].every(Boolean)) {
      response.error = "Missing required fields";
      status = 400;
      return NextResponse.json(response, { status });
    }

    await connectToDatabase();

    const emailLower = email.toLowerCase().trim();
    const usernameLower = username.toLowerCase().trim();

    const existingUser = await User.findOne({
      $or: [{ email: emailLower }, { username: usernameLower }],
    });

    if (existingUser) {
      response.error =
        existingUser.email === emailLower
          ? "Email already in use"
          : "Username already taken";
      status = 409;
    } else {
      const token = generateToken();
      const newUser = await User.create({
        fullName,
        email: emailLower,
        username: usernameLower,
        password, // pre-save hook hashes this
        role: "user",
        emailVerified: false,
        verificationToken: token,
        verificationTokenExpiry: generateTokenExpiry(),
        verificationTokenPurpose: "signup",
      });

      const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify?email=${encodeURIComponent(emailLower)}&token=${encodeURIComponent(token)}`;

      await sendEmail({
        to: emailLower,
        subject: "Verify Your Email",
        html: emailVerificationTemplate(fullName || usernameLower, verifyUrl),
      });

      response.message = "User created. Verification email sent.";
      status = 201;
    }
  } catch (err) {
    console.error("Signup error:", err);
    response.error = "Internal server error";
    status = 500;
  }

  return NextResponse.json(response, { status });
}
