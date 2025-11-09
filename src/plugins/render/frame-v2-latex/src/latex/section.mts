import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import { renderMathjaxTo } from "./latex.mjs";

export const latexSection: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const element = document.createElement("math");
  element.style.padding = "1em";
  const children = document.createElement("span");
  element.appendChild(children);
  // element.classList.add("ranki-code");
  // const pre = document.createElement("pre");
  // element.appendChild(pre);
  // pre.style.paddingInline = "1em";
  // pre.style.paddingBlock = "0em 1em";

  // const code = document.createElement("code");
  // pre.appendChild(code);
  // const raw = t.source.raw.trim();
  // code.innerHTML = raw;

  return {
    element,
    slots: {
      children,
    },
    onLoad: [
      async () => {
        renderMathjaxTo(children, t.source.raw);
      },
    ],
  };
};
