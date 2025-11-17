import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import { renderMathjaxTo } from "./latex.mjs";
import css from "./section.css?raw";
import { AnkiUi } from "@ranki/package-anki-ui";

export const latexSection: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const element = document.createElement("div");
  element.classList.add("latex-block");
  const h = AnkiUi.horizontalScroller();
  element.appendChild(h.element);
  h.subtree.left().innerText = ["(", t.depth.toString(), ")"].join("");

  return {
    element,
    css: [
      {
        id: "latex-block-section",
        css,
      },
      ...h.css!,
    ],
    afterMount: [
      async () => {
        renderMathjaxTo(h.slots.children!, t.source.raw);
      },
    ],
  };
};
