import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import Prism from "prismjs";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-javascript.js";
import prismCss from "./prism/prism-atom-dark.css?raw";
// import css from "./section.css?raw";
import { NO_LANGUAGE, TEMPgetLanguageName } from "./TEMPgetLanguageName.mjs";

export const text: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const element = document.createElement("span");
  // element.classList.add("code-block");
  // const h = AnkiUi.horizontalScroller();
  // element.appendChild(h.element);
  // const pre = document.createElement("pre");
  // const code = document.createElement("code");
  // pre.appendChild(code);
  // h.slots.children!.appendChild(pre);

  // ANKI trim new lines
  const raw = t.source.raw.replace("\n", " ");

  // // TODO prism already offers a line numbers solution. so use that instead
  // h.subtree.left().innerHTML = Array(raw.split("\n").length)
  //   .fill(null)
  //   .map((_, i) => (i + 1).toString().padStart(3, " "))
  //   .join("<br>");

  const language = TEMPgetLanguageName(t);
  const highlighted =
    language === NO_LANGUAGE
      ? raw
      : Prism.highlight(raw, Prism.languages[language], language);
  element.innerHTML = highlighted;

  return {
    element,
    css: [
      // ...h.css!,
      {
        id: "prism-atom-dark",
        css: prismCss,
      },
      // {
      //   id: "code-block-section",
      //   css,
      // },
    ],
    beforeUnmount: [
      // ...h.beforeUnmount
    ],
    afterMount: [
      // ...h.afterMount,
      // async () => {
      //   element.addEventListener("click", async () => {
      //     try {
      //       await navigator.clipboard.writeText(raw);
      //       console.log("Copied to clipboard:", raw);
      //     } catch (err) {
      //       console.log("Copy failed", navigator.clipboard);
      //     }
      //   });
      // },
    ],
  };
};
