import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import Prism from "prismjs";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-javascript.js";
import prismCss from "./prism/prism-atom-dark.css?raw";
import css from "./section.css?raw";
import { TEMPgetLanguageName } from "./TEMPgetLanguageName.mjs";
import { AnkiUi } from "@ranki/package-anki-ui";

export const codeSection: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const element = document.createElement("div");
  element.classList.add("code-block");
  const h = AnkiUi.horizontalScroller();
  element.appendChild(h.element);
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  pre.appendChild(code);
  h.slots!.content.appendChild(pre);

  const raw = t.source.raw.trim();

  // TODO prism already offers a line numbers solution. so use that instead
  h.slots!.left.innerHTML = Array(raw.split("\n").length)
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
      ...h.css!,
    ],
    onLoad: [
      async () => {
        element.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(raw);
            console.log("Copied to clipboard:", raw);
          } catch (err) {
            console.log("Copy failed", navigator.clipboard);
          }
        });
      },
    ],
  };
};
