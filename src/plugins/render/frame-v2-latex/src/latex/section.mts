import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import { renderMathjaxTo } from "./latex.mjs";
import html from "./section.html?raw";
import css from "./section.css?raw";

export const latexSection: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const container = document.createElement("div");
  container.innerHTML = html;
  const element = container.firstElementChild! as HTMLDivElement;
  const equation = element.querySelector<HTMLDivElement>(".equation")!;
  const lineNum = container.querySelector(".line-number") as HTMLSpanElement;
  lineNum.innerText = ["(", t.depth.toString(), ")"].join("");

  return {
    element,
    css: [
      {
        id: "latex-block-section",
        css,
      },
    ],
    onLoad: [
      async () => {
        renderMathjaxTo(equation, t.source.raw);
      },
    ],
  };
};
