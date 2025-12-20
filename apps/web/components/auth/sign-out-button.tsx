"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/supabase/auth";
import { Icons } from "@/components/ui/icons";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function handleSignOut() {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={isLoading}>
      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      Sign Out
    </Button>
  );
}
