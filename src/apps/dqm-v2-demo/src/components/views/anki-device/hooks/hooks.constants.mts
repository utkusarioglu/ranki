import type { RankiFilesRecord } from "./hooks.types.mts";

export const R2_VARIANT_FILES: RankiFilesRecord = {
  core: {
    css: ["_ranki2.css"],
    html: ["template-core.html"],
    js: ["_ranki2.js"],
  },
  devtools: {
    css: ["_ranki2.css"],
    html: ["template-devtools.html"],
    js: ["_ranki2.devtools.js"],
  },
  o11y: {
    css: ["_ranki2.css"],
    html: ["template-observable.html"],
    js: ["_ranki2.o11y.js"],
  },
};

export const DEFAULT_RANKI_FILES = {
  css: {},
  epoch: 0,
  html: {},
  js: {},
};
