"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpSchema, type SignUpValues } from "@/lib/schemas/auth";
import { signUpWithEmail } from "@/lib/supabase/auth";
import { SocialAuthButton } from "./social-auth-button";
import { Icons } from "@/components/ui/icons";

export function SignupForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: SignUpValues) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const result = await signUpWithEmail(data.email, data.password);

    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {success ? (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h3 className="text-xl font-bold">Check your email</h3>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to your email address.
          </p>
          <Button variant="outline" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors?.email && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register("password")}
                />
                {errors?.password && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="confirmPassword">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register("confirmPassword")}
                />
                {errors?.confirmPassword && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {error && <p className="px-1 text-xs text-red-600">{error}</p>}
              <Button disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign Up with Email
              </Button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <SocialAuthButton />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="hover:text-brand underline underline-offset-4"
            >
              Already have an account? Login
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
