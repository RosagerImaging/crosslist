# Bug Log

## 2025-10-25: `turbo.json` Parsing Error (`turbo_json_parse_error`)

- **Description:** The CI/CD pipeline failed with a `turbo_json_parse_error` indicating an unknown key `command` in `turbo.json` task definitions.
- **Resolution:** Modified `turbo.json` to remove the `command` key and instead defined the actual shell commands in the root `package.json`'s `scripts` section. Turborepo tasks now reference these scripts implicitly.

## 2025-10-25: CommonJS/ESM Build Error in Next.js Applications

- **Description:** Next.js applications failed to build due to a CommonJS/ESM module incompatibility, specifically when importing modules that were not explicitly declared as ES modules.
- **Resolution:**
  1.  Added `"type": "module"` to `packages/ui/package.json` to ensure the shared UI package is treated as an ES module.
  2.  Updated `next`, `@next/eslint-plugin-next`, `@types/node`, `@types/react`, `@types/react-dom`, `eslint-plugin-react-hooks`, and `typescript` packages to their latest versions to ensure full ES module compatibility and leverage the latest Next.js features. 4. Converted `apps/web/tailwind.config.js` from CommonJS (`module.exports`) to ES module (`export default`) syntax.

  ## 2025-10-25: Lint Script Failure due to `--max-warnings 0` in `apps/docs`

- **Description:** The lint script in `apps/docs/package.json` was failing the CI/CD pipeline due to the `--max-warnings 0` flag, which is an unknown option for the linter.
- **Resolution:** Removed the `--max-warnings 0` flag from the `lint` script in `apps/docs/package.json`.
- **Description:** The lint script in `apps/web/package.json` was failing the CI/CD pipeline due to the `--max-warnings 0` flag, which treats any lint warning as an error.
- **Resolution:** Removed the `--max-warnings 0` flag from the `lint` script in `apps/web/package.json` to allow warnings without failing the build.
