"use client"

import * as React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "@/lib/supabase/auth"
import { Icons } from "@/components/ui/icons"

export function SocialAuthButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" type="button" disabled={isLoading} onClick={loginWithGoogle}>
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.google className="mr-2 h-4 w-4" />
      )}{" "}
      Google
    </Button>
  )
}
