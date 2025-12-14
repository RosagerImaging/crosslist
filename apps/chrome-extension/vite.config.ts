import { defineConfig, loadEnv } from 'vite';
import webExtension from 'vite-plugin-web-extension';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const rootDir = resolve(__dirname, '../../'); // Resolve to project root
  const env = loadEnv(mode, rootDir, 'VITE_'); // Load env variables from project root

  console.log('VITE_EXT_MATCHES_HOST from .env:', env.VITE_EXT_MATCHES_HOST);

  return {
    root: '.',
    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
    },
    plugins: [
      webExtension({
        manifest: 'manifest.json',
        useDynamicUrlWebAccessibleResources: false,
        transformManifest: (manifest) => {
          if (env.VITE_EXT_MATCHES_HOST) {
            manifest.externally_connectable.matches = [env.VITE_EXT_MATCHES_HOST];
          } else {
            manifest.externally_connectable.matches = ["*://localhost/*"]; // Fallback
          }
          return manifest;
        },
      }),
    ],
  };
});
