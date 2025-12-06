import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";

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
      turbo: turboPlugin,
      "@typescript-eslint": {},
    },
    parser: "@typescript-eslint/parser",
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      "only-warn": {},
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