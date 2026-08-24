import fs from "node:fs";
import chalk from "chalk";
import yaml from "yaml";
import path from "node:path";
import {
  DEMO_APP_DEV_COPY_PATH,
  DEMO_APP_DIST_COPY_PATH,
  DOCKER_COMPOSE_PATH,
  DOCKER_TARGET_PATH,
  INCLUDE_FILES,
  OUT_DIR,
  PAD,
  TARGET_DIRS,
  TEMPLATE_FILES,
} from "./vite.constants";

function title(t: string) {
  console.log("");
  console.log(chalk.black.bgGreen.bold(t.toUpperCase()));
  console.log("");
}

export function cleanRankiTargets() {
  return new Promise<void>((resolve, reject) => {
    title(" CLEAN TARGETS ");

    const RM_DIRS = [DEMO_APP_DEV_COPY_PATH, DEMO_APP_DIST_COPY_PATH];

    RM_DIRS.forEach((rmPath) => {
      try {
        fs.rmSync(rmPath, { recursive: true, force: true });
      } catch (e) {
        console.log("PATH REMOVAL FAILED", e);
        reject(e);
      }
      try {
        fs.mkdirSync(rmPath);
      } catch (e) {
        console.log("PATH CREATION FAILED", e);
        reject(e);
      }
      resolve();
    });
  });
}

const compose = fs.readFileSync(DOCKER_COMPOSE_PATH).toString();
const bind = yaml.parse(compose);
const targetPath =
  bind.services.dev.volumes.find(
    // @ts-expect-error
    (v) => v.target === DOCKER_TARGET_PATH,
  ).source || chalk.red("Failed to determine");

export function copyArtifacts() {
  return new Promise<void>((r) => {
    title(" COPY TO TARGETS ");
    console.log([chalk.gray("Target Path:".padEnd(PAD)), targetPath].join(" "));

    const files = fs.readdirSync(OUT_DIR, { withFileTypes: true });
    for (const file of files) {
      if (
        !file.name.startsWith("_ranki2") &&
        !INCLUDE_FILES.includes(file.name) &&
        !Object.values(TEMPLATE_FILES).includes(file.name)
        // file.name !== TEMPLATE_FILES
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
    r();
  });
}

export function displayTemplate() {
  return new Promise<void>((resolve, reject) => {
    const templateHtml = path.join(OUT_DIR, TEMPLATE_FILES.core);

    title(" TEMPLATES ");

    try {
      const templates = [
        {
          displayName: "FRONT",
          fieldValue: "Q",
        },
        {
          displayName: "BACK",
          fieldValue: "N",
        },
      ]
        .map((side) =>
          [
            chalk.gray(`<!-- ${side.displayName} TEMPLATE -->`),
            fs
              .readFileSync(templateHtml)
              .toString()
              .replace("{{FACE}}", side.fieldValue)
              .replace(
                "{{TEMPLATE_CONFIG}}",
                "# Place your template config here",
              )
              .replace("{{STORAGE_CONFIG}}", "/_ranki2_user_config.yml"),
          ].join("\n"),
        )
        .join("\n\n");
      console.log(templates);
      resolve();
    } catch (e) {
      // console.log(e);
      reject(e);
    }
  });
}

export function rankiArtifactActions(tasks: (() => Promise<void>)[]) {
  function chainTasks() {
    let p = Promise.resolve();

    tasks.forEach((t) => {
      p = p.then(() => t());
    });

    p.catch((e) => console.error(e));

    return p;
  }

  return {
    name: "ranki-artifact-actions",
    apply: "build" as "build",
    buildEnd() {
      setTimeout(() => chainTasks(), 5e3);
    },
  };
}
