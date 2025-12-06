import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
// import turboPlugin from "eslint-plugin-turbo"; // Temporarily disabled

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    extends: [
      "plugin:@typescript-eslint/recommended"
    ],
    plugins: {
      // turbo: turboPlugin, // Temporarily disabled
      "@typescript-eslint": {},
      "only-warn": {},
    },
    parser: "@typescript-eslint/parser",
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
