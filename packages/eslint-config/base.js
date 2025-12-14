import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
// import turboPlugin from "eslint-plugin-turbo"; // Temporarily disabled

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      // turbo: turboPlugin, // Temporarily disabled
      "only-warn": {},
    },
    rules: {
      // "turbo/no-undeclared-env-vars": "warn", // Temporarily disabled
    },
  },
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
