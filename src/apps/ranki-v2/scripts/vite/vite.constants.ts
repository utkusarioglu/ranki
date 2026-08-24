export const OUT_DIR = "build";

export const DOCKER_TARGET_PATH = "/target";

export const DEMO_APP_DEV_COPY_PATH =
  "/workdir/src/apps/dqm-v2-demo/public/ranki-v2";

export const DEMO_APP_DIST_COPY_PATH =
  "/workdir/src/apps/dqm-v2-demo/dist/ranki-v2";

export const TARGET_DIRS = [
  DOCKER_TARGET_PATH,
  // DEMO_APP_DEV_COPY_PATH,
  // DEMO_APP_DIST_COPY_PATH,
];

export const TEMPLATE_FILES = {
  core: "template-core.html",
  observable: "template-observable.html",
  devtools: "template-devtools.html",
};

export const INCLUDE_FILES = ["_ranki2_user_config.yml"];

export const DOCKER_COMPOSE_PATH = "/workdir/.docker/docker-compose.yml";

export const PAD = 15;
