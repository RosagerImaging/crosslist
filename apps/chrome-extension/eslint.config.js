import baseConfig from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  {
    // Add any specific rules for the Chrome extension here
    // For example, if you're using browser APIs, you might want to configure `env.browser: true`
    // or add specific globals.
  },
];
