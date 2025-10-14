"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

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

type FormValues = {
  identifier: string;
};

export default function ForgotPasswordPage() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      identifier: "",
    },
  });

  // 🔒 Lock scroll when popup is open
  useEffect(() => {
    if (popupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [popupOpen]);

  async function sendResetLink(identifier: string) {
    setPopupOpen(false);
    setPopupMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/forgot-password", {
        identifier,
      });

      setPopupMessage(
        response.data.message ||
          "Verification link sent successfully. Please check your email."
      );
      setPopupOpen(true);
      form.reset();
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      setPopupMessage(
        err.response?.data?.error || err.message || "An error occurred."
      );
      setPopupOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: FormValues) {
    await sendResetLink(data.identifier);
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8">
          <h1 className="mb-6 text-center text-3xl font-semibold text-gray-900 dark:text-white">
            Forgot Password
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <FormField
                control={form.control}
                name="identifier"
                rules={{ required: "Email or username is required" }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Email or Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your email or username"
                        autoComplete="username"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mt-6 w-full flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin w-4 h-4" />
                    Sending...
                  </>
                ) : (
                  "Send Verification Link"
                )}
              </Button>
            </form>
          </Form>

          {/* Navigation Links */}
          <div className="mt-6 flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="/login"
              className="text-primary hover:underline dark:text-blue-400"
            >
              ← Back to Login
            </Link>
            <Link
              href="/signup"
              className="text-primary hover:underline dark:text-blue-400"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>

      {/* Animated Popup */}
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
              <p className="text-gray-800 dark:text-gray-100">{popupMessage}</p>
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
