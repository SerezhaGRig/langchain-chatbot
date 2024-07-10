import * as esbuild from "esbuild";
import { createBuildSettings } from "./settings.js";

const settings = createBuildSettings({
  entryPoints: ["src/documents/documentLoader.ts"],
  outfile: "esBundle/documentLoader.js",
});

await esbuild.build(settings);
