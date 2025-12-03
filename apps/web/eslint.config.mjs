import { defineConfig, globalIgnores } from "eslint/config";
import unicorn from "eslint-plugin-unicorn";
import nextPlugin from "@next/eslint-plugin-next";

const eslintConfig = defineConfig([
  {
    plugins: {
      "@next/next": nextPlugin,
      unicorn,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "unicorn/filename-case": [
        "error",
        {
          "case": "kebabCase",
          "ignore": [ "layout.tsx", "page.tsx" ]
        }
      ]
    }
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
