"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { StatusMessage } from "@/components/Model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type FormValues = {
  password: string;
  confirmPassword: string;
};

type StatusType =
  | "verifying"
  | "valid"
  | "invalid"
  | "submitting"
  | "success"
  | "error";

function NewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<StatusType>("verifying");
  const [message, setMessage] = useState<string>("Verifying reset token...");
  const [redirectTimer, setRedirectTimer] = useState<number>(5);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = status === "verifying" || status === "submitting";
  const isError = status === "invalid" || status === "error";
  const isSuccess = status === "success";
  const isSubmitting = status === "submitting";

  // ✅ Verify token on mount
  useEffect(() => {
    if (!email || !token) {
      setStatus("invalid");
      setMessage("Invalid reset link.");
      return;
    }

    async function verifyToken() {
      try {
        const res = await axios.post("/api/auth/reset-password", {
          email,
          token,
          action: "verify",
        });

        if (res.data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
          setMessage(res.data.message || "Reset link is invalid or expired.");
        }
      } catch (err: unknown) {
        const error = err as AxiosError<{ error: string }>;
        setStatus("invalid");
        setMessage(error.response?.data?.error || "Failed to verify token.");
      }
    }

    verifyToken();
  }, [email, token]);

  // ⏳ Redirect after success
  useEffect(() => {
    if (status === "success") {
      if (redirectTimer <= 0) {
        router.push("/signin");
        return;
      }

      const timerId = setTimeout(() => {
        setRedirectTimer((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [status, redirectTimer, router]);

  // 🧹 Clear top-level error when user types
  useEffect(() => {
    const subscription = form.watch(() => {
      if (formError) setFormError(null);
    });
    return () => subscription.unsubscribe();
  }, [form, formError]);

  // 📝 Handle form submission
  async function onSubmit(data: FormValues) {
    if (!email || !token) {
      setStatus("error");
      setMessage("Missing email or token.");
      return;
    }

    setStatus("submitting");
    setMessage("Updating your password...");
    setFormError(null);

    try {
      await axios.post("/api/auth/reset-password", {
        email,
        token,
        password: data.password,
        action: "reset",
      });

      setStatus("success");
      setMessage("Password updated successfully! Redirecting to login...");
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      const serverError =
        error.response?.data?.error || "Failed to reset password.";

      if (serverError.toLowerCase().includes("password cannot be the same")) {
        setFormError(serverError);
        setStatus("valid"); // allow retry
      } else {
        setStatus("error");
        setMessage(serverError);
      }
    }
  }

  // 🔄 Conditional render states
  if (isLoading) {
    return <StatusMessage status="loading" message={message} />;
  }

  if (isError) {
    return (
      <StatusMessage
        status="error"
        message={message}
        actionLabel="Request New Reset Link"
        onActionClick={() => router.push("/forgot-password")}
      />
    );
  }

  if (isSuccess) {
    return (
      <StatusMessage
        status="success"
        message={message}
        countdown={redirectTimer}
      />
    );
  }

  // ✅ Main Form UI using shadcn Card
  return (
    <Card className="w-full max-w-md shadow-lg border border-border">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">Set New Password</CardTitle>
        <CardDescription>
          For account <strong>{email}</strong>
        </CardDescription>
      </CardHeader>

      <CardContent>
        {formError && (
          <div className="mb-6 text-center text-red-600 dark:text-red-400 font-semibold border border-red-400 dark:border-red-700 bg-red-100 dark:bg-red-900/30 px-4 py-3 rounded-md">
            {formError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === form.getValues("password") ||
                  "Passwords do not match",
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          onClick={() => router.push("/login")}
          className="text-primary underline"
          disabled={isSubmitting}
        >
          Back to Sign In
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 p-4">
      <Suspense fallback={<div className="p-8 text-gray-500">Loading form...</div>}>
        <NewPasswordForm />
      </Suspense>
    </div>
  );
}
