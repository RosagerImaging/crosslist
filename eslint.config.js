import { config as baseConfig } from "@repo/eslint-config/base";
import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  ...nextJsConfig.map(config => ({
    ...config,
    files: ["apps/web/**/*.{ts,tsx}", "apps/docs/**/*.{ts,tsx}"],
  })),
  {
    files: ["apps/chrome-extension/**/*.{ts,tsx}"],
    rules: {
      // Specific rules for chrome extension
    },
  },
  {
    files: ["packages/api-client/**/*.{ts,tsx}"],
    rules: {
      // Specific rules for api-client
    },
  },
];
