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
  // const element = document.createElement("math");
  // element.style.padding = "1em";
  // const children = document.createElement("span");
  // element.appendChild(children);
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
    // slots: {
    //   children,
    // },
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
