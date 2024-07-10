import * as esbuild from "esbuild";
import { createBuildSettings } from "./settings.js";

const settings = createBuildSettings({
  entryPoints: ["src/main.ts"],
  outfile: "esBundle/bundle.js",
});

await esbuild.build(settings);
