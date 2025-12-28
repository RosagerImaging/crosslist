import { defineConfig, loadEnv } from "vite";
import webExtension from "vite-plugin-web-extension";
import { resolve } from "path";
import { copyFileSync, mkdirSync } from "fs";

export default defineConfig(({ mode }) => {
  const rootDir = resolve(__dirname, "../../"); // Resolve to project root
  const env = loadEnv(mode, rootDir, "VITE_"); // Load env variables from project root

  console.log("VITE_EXT_MATCHES_HOST from .env:", env.VITE_EXT_MATCHES_HOST);

  return {
    root: ".",
    build: {
      outDir: resolve(__dirname, "dist"),
      emptyOutDir: true,
    },
    plugins: [
      webExtension({
        manifest: "manifest.json",
        useDynamicUrlWebAccessibleResources: false,
        transformManifest: (manifest) => {
          // Chrome doesn't support ports in match patterns
          manifest.externally_connectable.matches = [
            "*://localhost/*",
            "https://crosslist-xi.vercel.app/*",
          ];
          return manifest;
        },
      }),
      // Copy icons to dist/icons after build
      {
        name: "copy-icons",
        closeBundle() {
          const iconsDir = resolve(__dirname, "dist/icons");
          mkdirSync(iconsDir, { recursive: true });

          ["icon16.png", "icon48.png", "icon128.png"].forEach((icon) => {
            copyFileSync(
              resolve(__dirname, "icons", icon),
              resolve(iconsDir, icon),
            );
          });
        },
      },
    ],
  };
});
