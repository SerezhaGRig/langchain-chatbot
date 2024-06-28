import * as esbuild from 'esbuild';
import { createBuildSettings } from './settings.js';

const settings = createBuildSettings({
    minify: true,
    platform: 'node',
    banner: {
        js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);import path from 'path';import { fileURLToPath } from 'url';const __filename = fileURLToPath(import.meta.url);const __dirname = path.dirname(__filename);"
    },
});

await esbuild.build(settings);
