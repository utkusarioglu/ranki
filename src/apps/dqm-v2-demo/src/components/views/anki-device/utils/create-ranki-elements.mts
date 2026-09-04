import type { RankiElements, RankiFiles } from "../screen/AnkiScreen.types.mts";

import { createFragment } from "./create-fragment.mts";

export function createRankiElements(parts: RankiFiles): RankiElements {
  const fragment = createFragment(parts);

  const js = Object.entries(parts.js).map(([name, j]) => {
    const jsScript = document.createElement("script");
    jsScript.type = "module";
    jsScript.id = name.replace(".", "-");
    jsScript.innerHTML = j;
    return jsScript;
  });

  const css = Object.entries(parts.css).map(([name, j]) => {
    const style = document.createElement("style");
    style.id = name.replace(".", "-");
    style.innerHTML = j;
    return style;
  });

  return {
    css,
    fragment,
    jss: js,
  };
}
