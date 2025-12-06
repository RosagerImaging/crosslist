import { config as baseConfig } from "@repo/eslint-config/base";
import { nextJsConfig } from "@repo/eslint-config/next-js";

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
