"use client";

import React, { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FaGithub, FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

// Zod validation schema
const signinSchema = z.object({
  identifier: z
    .string()
    .min(3, "Email or username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SigninFormInputs = z.infer<typeof signinSchema>;

export default function SignInClient() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [inlineError, setInlineError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const form = useForm<SigninFormInputs>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // 🧩 Clear inline error when input changes
  useEffect(() => {
    const subscription = form.watch(() => {
      if (inlineError) setInlineError("");
    });
    return () => subscription.unsubscribe();
  }, [form, inlineError]);

  // 🔐 Redirect if already signed in
  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      if (session) router.push("/");
    }
    checkSession();
  }, [router]);

  // 🔒 Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
  }, [modalOpen]);

  async function onSubmit(data: SigninFormInputs) {
    setIsLoading(true);
    setInlineError("");

    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.toLowerCase().includes("verify your email")) {
          setModalTitle("Email Not Verified");

          const sentNew =
            result.error.toLowerCase().includes("new verification link");

          setModalMessage(
            sentNew
              ? "✅ A new verification link has been sent to your email. Please check your inbox."
              : "🕓 A verification link has already been sent earlier. Please check your inbox."
          );

          setModalOpen(true);
        } else {
          setInlineError(result.error);
        }
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Sign in unexpected error:", error);
      setInlineError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGitHubSignIn() {
    setIsGitHubLoading(true);
    try {
      await signIn("github");
    } catch (error) {
      console.error("GitHub sign in error:", error);
      setIsGitHubLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      console.error("Google sign in error:", error);
      setIsGoogleLoading(false);
    }
  }

  const isAnyLoading = isLoading || isGitHubLoading || isGoogleLoading;

  return (
    <>
      <div className="flex min-h-screen items-center justify-center mt-15 p-4 bg-gray-50 dark:bg-zinc-900">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-900 dark:text-white">
              Log in
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {/* Social Buttons */}
            <div className="flex gap-4 mb-6">
              <Button
                variant="outline"
                className="flex-1 flex items-center gap-2 justify-center"
                onClick={handleGitHubSignIn}
                disabled={isAnyLoading}
              >
                {isGitHubLoading ? (
                  <>
                    <FaSpinner className="animate-spin w-4 h-4" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaGithub className="w-5 h-5" />
                    GitHub
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="flex-1 flex items-center gap-2 justify-center"
                onClick={handleGoogleSignIn}
                disabled={isAnyLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <FaSpinner className="animate-spin w-4 h-4" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FcGoogle className="w-5 h-5" />
                    Google
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              <span className="mx-4 text-sm text-muted-foreground">or</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            {/* Inline Error */}
            {inlineError && (
              <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm border border-red-200">
                {inlineError}
              </div>
            )}

            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your email or username"
                          disabled={isAnyLoading}
                          autoComplete="username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          disabled={isAnyLoading}
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isAnyLoading}>
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="px-8 pt-0">
            <p className="w-full text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* ✨ Animated Modal for Email Verification */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              key="modal"
              className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-sm w-full shadow-2xl cursor-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {modalTitle}
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                {modalMessage}
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setModalOpen(false)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
