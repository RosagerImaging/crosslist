"use client";

// This component ensures Sentry client config is loaded
// Import has side effect of initializing Sentry on the client
import "@/sentry.client.config";

export function SentryProvider({ children }: { children: React.ReactNode }) {
  // This component just ensures the import happens
  // No additional logic needed - Sentry.init() is called in the import
  return <>{children}</>;
}
