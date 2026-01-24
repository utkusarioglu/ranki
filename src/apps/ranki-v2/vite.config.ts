import { defineConfig } from "vite";
import fs from "node:fs";
import chalk from "chalk";
import yaml from "yaml";
import url from "node:url";
import path from "node:path";
import babel from "@rollup/plugin-babel";

const OUT_DIR = "build";
const DOCKER_TARGET_PATH = "/target";
const DEMO_APP_DEV_COPY_PATH = "/workdir/src/apps/dqm-v2-demo/public/ranki-v2";
const DEMO_APP_DIST_COPY_PATH = "/workdir/src/apps/dqm-v2-demo/dist/ranki-v2";
const TARGET_DIRS = [
  DOCKER_TARGET_PATH,
  DEMO_APP_DEV_COPY_PATH,
  DEMO_APP_DIST_COPY_PATH,
];
const TEMPLATE_FILE = "template.html";
const INCLUDE_FILES = ["_ranki2_user_config.yml"];
const PAD = 15;

const __abspath = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__abspath);
const RM_DIRS = [DEMO_APP_DEV_COPY_PATH, DEMO_APP_DIST_COPY_PATH];

RM_DIRS.forEach((rmPath) => {
  try {
    fs.rmSync(rmPath, { recursive: true, force: true });
  } catch (e) {
    console.log("PATH REMOVAL FAILED", e);
    process.exit(1);
  }
  try {
    fs.mkdirSync(rmPath);
  } catch (e) {
    console.log("PATH CREATION FAILED", e);
    process.exit(1);
  }
});

const compose = fs
  .readFileSync("/workdir/.docker/docker-compose.yml")
  .toString();
const bind = yaml.parse(compose);
const targetPath =
  bind.services.dev.volumes.find(
    // @ts-expect-error
    (v) => v.target === DOCKER_TARGET_PATH,
  ).source || chalk.red("Failed to determine");

export default defineConfig({
  server: {
    host: true,
    port: 3000,
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
      extensions: [".mts", ".ts", ".js", ".mjs"],
      presets: [["@babel/preset-typescript", { allowDeclareFields: true }]],
      plugins: [["@babel/plugin-proposal-decorators", { version: "2023-05" }]],
    }),
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
              !INCLUDE_FILES.includes(file.name) &&
              file.name !== TEMPLATE_FILE
            ) {
              console.log(chalk.gray("Ignoring:".padEnd(PAD)), file.name);
              continue;
            }
            const sourceAbspath = path.join(OUT_DIR, file.name);
            TARGET_DIRS.forEach((targetDir) => {
              const targetAbspath = path.join(targetDir, file.name);
              fs.copyFileSync(sourceAbspath, targetAbspath);
              console.log(
                [
                  chalk.green("Copied:".padEnd(PAD)),
                  sourceAbspath,
                  chalk.gray("=>"),
                  targetAbspath,
                ].join(" "),
              );
            });
          }

          const templateHtml = path.join(OUT_DIR, TEMPLATE_FILE);

          console.log("");
          try {
            const templates = ["Q", "N"]
              .map((face) =>
                [
                  chalk.gray(`<!-- TEMPLATE ${face} -->`),
                  fs
                    .readFileSync(templateHtml)
                    .toString()
                    .replace("{{FACE}}", face)
                    .replace(
                      "{{TEMPLATE_CONFIG}}",
                      "# Place your template config here",
                    )
                    .replace("{{STORAGE_CONFIG}}", "/_ranki2_user_config.yml"),
                ].join("\n"),
              )
              .join("\n\n");
            console.log(templates);
          } catch (e) {
            console.log(e);
          }
        }, 5e3);
      },
    },
  ],
  build: {
    // cssCodeSplit: false,
    minify: true,
    // target: TARGET,
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
        inlineDynamicImports: true,
        // manualChunks: (id) => {
        //   if (id.includes("mermaid") || id.includes("katex")) {
        //     return "_ranki2_mermaid";
        //   } else if (id.includes("mathjax.mts")) {
        //     return "_ranki2_mathjax";
        //   }
        // },
        entryFileNames: "_ranki2.js", // The name of your output bundle
        chunkFileNames: "_ranki2_[name].js",
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
    // esbuildOptions: {
    //   target: TARGET,
    // },
    include: [
      // "langium",
      "mathjax-full/js/mathjax.js",
      "mathjax-full/js/input/tex.js",
      "mathjax-full/js/output/svg.js",
    ],
  },
});
