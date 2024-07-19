import esbuildPluginTsc from "esbuild-plugin-tsc";

export function createBuildSettings(options) {
  return {
    minify: true,
    platform: "node",
    target: "es2022",
    format: "esm",
    banner: {
      js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);import path from 'path';import { fileURLToPath } from 'url';const __filename = fileURLToPath(import.meta.url);const __dirname = path.dirname(__filename);",
    },
    bundle: true,
    plugins: [
      esbuildPluginTsc({
        force: true,
      }),
    ],
    ...options,
  };
}
