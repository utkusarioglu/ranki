import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import Prism from "prismjs";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-javascript.js";
import prismCss from "./prism/prism-atom-dark.css?raw";
import html from "./section.html?raw";
import css from "./section.css?raw";
import { TEMPgetLanguageName } from "./TEMPgetLanguageName.mjs";
// import section from "./section.css?raw";

export const codeSection: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const container = document.createElement("div");
  container.innerHTML = html;
  const element = container.querySelector<HTMLDivElement>(".section")!;
  const lineNum = container.querySelector<HTMLDivElement>(".line-numbers")!;
  const code = container.querySelector<HTMLElement>("code")!;

  const raw = t.source.raw.trim();

  // TODO prism already offers a line numbers solution. so use that instead
  lineNum.innerHTML = Array(raw.split("\n").length)
    .fill(null)
    .map((_, i) => (i + 1).toString().padStart(3, " "))
    .join("<br>");

  const language = TEMPgetLanguageName(t);
  const highlighted = Prism.highlight(raw, Prism.languages[language], language);
  code.innerHTML = highlighted;

  return {
    element,
    css: [
      {
        id: "prism-atom-dark",
        css: prismCss,
      },
      {
        id: "code-block-section",
        css,
      },
    ].filter((v) => v),
    onLoad: [
      async () => {
        element.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(raw);
            console.log("Copied to clipboard:", raw);
          } catch (err) {
            // console.log(navigator);
            // alert("failed to copy");
            // console.error("Failed to copy:", err);
          }
        });
      },
    ],
  };
};
