import { defineConfig } from "vite";
import path from "path";
import fs from "node:fs";
import chalk from "chalk";
import yaml from "yaml";

const OUT_DIR = "build";
const TARGET_DIR = "/target";
const TEMPLATE_FILE = "template.html";
const PAD = 15;

const compose = fs
  .readFileSync("/workdir/.docker/docker-compose.yml")
  .toString();
const bind = yaml.parse(compose);
const targetPath =
  bind.services.dev.volumes.find(
    // @ts-expect-error
    (v) => v.target === TARGET_DIR,
  ).source || chalk.red("Failed to determine");

export default defineConfig({
  plugins: [
    {
      name: "post-build-copy",
      apply: "build",
      buildEnd() {
        setTimeout(() => {
          console.log("");
          console.log(
            [chalk.gray("Target Path:".padEnd(PAD)), targetPath].join(" "),
          );
          console.log("");

          const files = fs.readdirSync(OUT_DIR, { withFileTypes: true });
          for (const file of files) {
            if (
              !file.name.startsWith("_ranki2") &&
              file.name !== TEMPLATE_FILE
            ) {
              console.log(chalk.gray("Ignoring:".padEnd(PAD)), file.name);
              continue;
            }
            const source = path.join(OUT_DIR, file.name);
            const target = path.join(TARGET_DIR, file.name);
            fs.copyFileSync(source, target);
            console.log(
              [
                chalk.green("Copied:".padEnd(PAD)),
                source,
                chalk.gray("=>"),
                target,
              ].join(" "),
            );
          }

          console.log("");

          const templates = ["A", "B"]
            .map(
              (face) => [
                chalk.gray(`Html Template ${face}:`),
                fs
                  .readFileSync(path.join(OUT_DIR, TEMPLATE_FILE))
                  .toString()
                  .replace("%FACE%", face),
              ],
              "",
            )
            .flat()
            .join("\n");
          console.log(templates);
          // console.log(
          //   [
          //     chalk.gray("Html Template:"),
          //     fs.readFileSync(path.join(OUT_DIR, TEMPLATE_FILE)),
          //     // "",
          //     // chalk.gray("Css Template:")
          //     // ""
          //   ].join("\n"),
          // );
        }, 3000);
      },
    },
  ],
  build: {
    outDir: OUT_DIR,
    assetsDir: ".",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, TEMPLATE_FILE),
      },
      // external: [
      //   "langium" // I have no idea why this causes issues
      // ],
      output: {
        inlineDynamicImports: false,
        manualChunks: (id) => {
          if (id.includes("mermaid") || id.includes("katex")) {
            return "_ranki2_mermaid";
          } else if (id.includes("mathjax.mts")) {
            return "_ranki2_mathjax";
          }
        },
        entryFileNames: "_ranki2.js", // The name of your output bundle
        chunkFileNames: "[name].js",
        format: "es", // Use 'es' for modern output, or 'iife' for self-contained
        assetFileNames: (assetInfo) => {
          if (assetInfo.name!.endsWith("css")) {
            return "_ranki2.css";
          }
          if (assetInfo.name!.endsWith("html")) {
            return "_ranki2.html";
          }
          return assetInfo.name!;
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      // "langium",
      "mathjax-full/js/mathjax.js",
      "mathjax-full/js/input/tex.js",
      "mathjax-full/js/output/svg.js",
    ],
  },
});
