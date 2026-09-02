import { DqmDemoError } from "_error";

import type { RankiFiles } from "../AnkiScreen.types.mts";

export const URL_TEMPLATE = "/%";

export function createFragment(parts: RankiFiles) {
  const htmlTemplates = Object.values(parts.html);
  if (htmlTemplates.length > 1) {
    throw new DqmDemoError({
      cause: null,
      code: "TOO_MANY_TEMPLATES",
      why: "Only a single template is expected",
    });
  }
  const html = htmlTemplates[0];
  const tpl = document.createElement("template");
  const replaced = html.replace(
    "{{STORAGE_CONFIG}}",
    URL_TEMPLATE.replace("%", "_ranki2_user_config.yml"),
  );
  tpl.innerHTML = replaced;
  const fragment = tpl.content;

  const inputElems = fragment.querySelectorAll("*");
  inputElems.forEach((e) => {
    e.innerHTML = "";
  });

  return fragment;
}
