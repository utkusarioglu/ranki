import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import Prism from "prismjs";
import "prismjs/components/prism-python.js";
import { css } from "./prism-atom-dark.css.mjs";

export const codeRenderer: RankiRenderPluginItemRenderFunction = (t) => {
  if (t.kind === "parent") {
    throw new Error("E_NOTATION CANNOT BE A PARENT");
  }

  const container = document.createElement("div");
  container.style.backgroundColor = "#151515";
  // container.style.border = "1px solid gray";
  // container.style.padding = "1em";

  // const style = document.createElement("style");
  // style.innerHTML = css;
  // document.head.appendChild(style);

  const hud = document.createElement("div");
  hud.style.fontSize = "0.8em";
  hud.style.borderBottomRightRadius = "1em";

  const langName = document.createElement("span");
  langName.innerText = "js";
  hud.style.backgroundColor = "#202020";
  hud.style.paddingInline = "1em";
  hud.style.paddingBlock = "0.5em";
  hud.style.width = "max-content";
  hud.appendChild(langName);
  container.appendChild(hud);

  const pre = document.createElement("pre");
  pre.style.paddingInline = "1em";
  pre.style.paddingBlock = "0em 1em";

  container.appendChild(pre);
  const code = document.createElement("code");
  pre.appendChild(code);
  const raw = t.source.raw;
  const highlighted = Prism.highlight(raw, Prism.languages.python, "python");
  code.innerHTML = highlighted;

  return {
    element: container,
    onLoad: () => {},
    css: [
      {
        id: "prism-atom-dark",
        css,
      },
    ],
  };
};
