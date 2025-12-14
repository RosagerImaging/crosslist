import { config as baseConfig } from "./packages/eslint-config/base.js";
import { nextJsConfig } from "./packages/eslint-config/next-js.js";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["**/.next/**", "**/dist/**", "**/next-env.d.ts"], // Global ignore for generated files and next-env.d.ts
  },
  ...baseConfig,
  ...nextJsConfig, // Use nextJsConfig directly without mapping or additional files/ignores
  {
    // Add import/resolver settings for monorepo support
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json', './packages/*/tsconfig.json', './apps/*/tsconfig.json'],
        },
      },
    },
  },
  {
    files: ["apps/chrome-extension/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        chrome: "readonly",
      },
    },
    rules: {
      "no-undef": "off", // Disable no-undef for chrome extension files
      // Specific rules for chrome extension
    },
  },
  {
    files: ["packages/api-client/**/*.{ts,tsx}"],
    rules: {
      // Specific rules for api-client
    },
  },
  {
    files: [
      "**/*.config.{js,mjs,cjs,ts}",
      "**/.eslintrc.{js,cjs}",
      "**/vite.config.ts",
      "apps/web/app/api/**/route.ts",
      "apps/web/app/auth/**/route.ts",
      "apps/web/lib/supabase/**/*.ts",
      "apps/web/middleware.ts",
      "apps/web/playwright.config.ts",
      "apps/web/playwright/**/*.{ts,js}"
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off", // Often needed for process.env
    },
  },
];
