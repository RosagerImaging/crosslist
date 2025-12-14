"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/schemas/auth"
import { resetPasswordForEmail } from "@/lib/supabase/auth"
import { Icons } from "@/components/ui/icons"

interface ForgotPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(data: ForgotPasswordValues) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const result = await resetPasswordForEmail(data.email)

    setIsLoading(false)

    if (!result.success) {
      setError(result.error || "Something went wrong. Please try again.")
      return
    }

    setSuccess(true)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      {success ? (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-muted-foreground">
            We&apos;ve sent a password reset link to your email address.
          </p>
        </div>
      ) : (
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
            {error && (
              <p className="px-1 text-xs text-red-600">{error}</p>
            )}
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Reset Link
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
