import { assertTransformParent } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
// import Prism from "prismjs";
// import "prismjs/components/prism-python.js";
// import "prismjs/components/prism-javascript.js";
// import prismCss from "./prism/prism-atom-dark.css?raw";
import css from "./section.css?raw";
// import { NO_LANGUAGE, TEMPgetLanguageName } from "./TEMPgetLanguageName.mjs";
import { AnkiUi } from "@ranki/package-anki-ui";

export const section: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformParent(t);
  const element = document.createElement("div");
  element.classList.add("code-block");
  const h = AnkiUi.horizontalScroller();
  element.appendChild(h.element);
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  pre.appendChild(code);
  h.slots.children!.appendChild(pre);
  const span = document.createElement("span");
  code.appendChild(span);

  // // ANKI trim new lines
  // const raw = t.source.raw.replace(/^[\r\n]+|[\r\n]+$/g, "");

  // // TODO prism already offers a line numbers solution. so use that instead
  // h.subtree.left().innerHTML = Array(raw.split("\n").length)
  //   .fill(null)
  //   .map((_, i) => (i + 1).toString().padStart(3, " "))
  //   .join("<br>");

  return {
    element,
    css: [
      ...h.css!,
      // {
      //   id: "prism-atom-dark",
      //   css: prismCss,
      // },
      {
        id: "code-block-section",
        css,
      },
    ],
    slots: {
      children: span,
    },
    beforeUnmount: [...h.beforeUnmount],
    afterMount: [
      ...h.afterMount,
      async () => {
        element.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(code.innerText);
            console.log("Copied to clipboard:", code.innerText);
          } catch (err) {
            console.log("Copy failed", navigator.clipboard);
          }
        });
      },
    ],
  };
};
