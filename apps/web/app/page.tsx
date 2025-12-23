"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function Home() {
  useEffect(() => {
    Sentry.logger.info("User triggered test log", {
      log_source: "sentry_test",
    });
  }, []);
  return (
    <main>
      <h1>Welcome to Crosslist!</h1>
      <p>This is the homepage of your Crosslist application.</p>
    </main>
  );
}
