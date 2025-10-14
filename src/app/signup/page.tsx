"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
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

import { Github, LoaderCircle, CheckCircle, AlertCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaSpinner } from "react-icons/fa";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import {
  debouncedCheckEmail,
  debouncedCheckUsername,
} from "@/utils/checkAvailability";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const form = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState<React.ReactNode>("");

  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const emailValue = form.watch("email");
  const usernameValue = form.watch("username");

  useEffect(() => {
    debouncedCheckEmail(emailValue, setEmailAvailable, setIsEmailChecking);
  }, [emailValue]);

  useEffect(() => {
    debouncedCheckUsername(
      usernameValue,
      setUsernameAvailable,
      setIsUsernameChecking
    );
  }, [usernameValue]);

  // 🔒 Lock scroll when popup is open
  useEffect(() => {
    if (popupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [popupOpen]);

  async function onSubmit(data: SignupFormInputs) {
    setIsLoading(true);
    try {
      await axios.post("/api/auth/register", data);

      setPopupMessage(
        <div className="space-y-2">
          <p>✅ Signup successful!</p>
          <p>A verification link has been sent to your email.</p>
          <p>Please check your inbox to verify your account.</p>
        </div>
      );
      setPopupOpen(true);

      form.reset();
      setEmailAvailable(null);
      setUsernameAvailable(null);
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.error || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      setPopupMessage(<p className="text-red-600">{message}</p>);
      setPopupOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGitHubSignUpButton() {
    setIsGitHubLoading(true);
    try {
      await signIn("github", { callbackUrl: "/" });
    } catch (error) {
      console.error("GitHub sign up error:", error);
      setIsGitHubLoading(false);
    }
  }

  async function handleGoogleSignUpButton() {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google sign up error:", error);
      setIsGoogleLoading(false);
    }
  }

  const isAnyLoading = isLoading || isGitHubLoading || isGoogleLoading;

  return (
    <>
      <div className="flex min-h-screen items-center justify-center mt-15 p-4 bg-gray-50 dark:bg-zinc-900">
        <Card className="w-full max-w-lg rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-white">
              Create an Account
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {/* Social Buttons */}
            <div className="flex gap-4 mb-6 flex-col sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleGitHubSignUpButton}
                disabled={isAnyLoading}
              >
                {isGitHubLoading ? (
                  <>
                    <FaSpinner className="animate-spin w-4 h-4" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Github className="w-5 h-5" />
                    GitHub
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleGoogleSignUpButton}
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

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              <span className="mx-4 text-sm text-muted-foreground">or</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            {/* Signup Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="John Doe"
                          disabled={isAnyLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Email
                      </FormLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          disabled={isAnyLoading}
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          {isEmailChecking && (
                            <LoaderCircle className="w-4 h-4 animate-spin text-gray-400" />
                          )}
                          {!isEmailChecking && emailAvailable === true && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {!isEmailChecking && emailAvailable === false && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      {emailValue &&
                        !isEmailChecking &&
                        emailAvailable === false && (
                          <p className="text-sm text-red-600 mt-1">
                            Email is already in use.
                          </p>
                        )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Username
                      </FormLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="yourusername"
                          disabled={isAnyLoading}
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          {isUsernameChecking && (
                            <LoaderCircle className="w-4 h-4 animate-spin text-gray-400" />
                          )}
                          {!isUsernameChecking &&
                            usernameAvailable === true && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          {!isUsernameChecking &&
                            usernameAvailable === false && (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                        </div>
                      </div>
                      {usernameValue &&
                        !isUsernameChecking &&
                        usernameAvailable === false && (
                          <p className="text-sm text-red-600 mt-1">
                            Username is already taken.
                          </p>
                        )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="******"
                          disabled={isAnyLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isAnyLoading ||
                    emailAvailable === false ||
                    usernameAvailable === false
                  }
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Signing up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="px-8 pt-0">
            <p className="w-full text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* ✨ Animated Popup */}
      <AnimatePresence>
        {popupOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopupOpen(false)}
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
              <div className="text-gray-800 dark:text-gray-100">
                {popupMessage}
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setPopupOpen(false)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
