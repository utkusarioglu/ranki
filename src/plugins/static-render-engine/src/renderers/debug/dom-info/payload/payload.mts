import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
import { TAGS } from "../constants.mjs";
import css from "./payload.css?raw";
import Prism from "prismjs";
import "prismjs/components/prism-markup.js";
import prismCss from "./prism/prism-atom-dark.css?raw";

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: () => {
    const element = document.createElement("div");
    const h = AnkiUi.horizontalScroller();
    element.innerText = "(collecting info)";

    return {
      element,
      css: [
        ...h.css!,
        {
          id: "prism-atom-dark",
          css: prismCss,
        },
        {
          id: "code-block-section",
          css,
        },
      ],
      afterMount: [
        ...(h.afterMount || []),
        async () => {
          element.innerText = "";
          element.classList.add("code-block");
          element.appendChild(h.element);
          const pre = document.createElement("pre");
          const code = document.createElement("code");
          pre.appendChild(code);
          h.getMount!().appendChild(pre);
          const span = document.createElement("span");
          code.appendChild(span);

          const left = h.subtree!.left();
          const language = "markup";
          const clone = document.documentElement.cloneNode(true) as HTMLElement;

          const excluded: string[] = []; // TODO find a sensible way of getting the selector for the document root to here through preferences
          if (excluded.length) {
            excluded.forEach((e) => {
              const el = clone.querySelector(e);
              el?.remove();
            });
          }

          const outerHtml = clone.outerHTML;
          left.innerHTML = Array(outerHtml.split("\n").length)
            .fill(null)
            .map((_, i) => (i + 1).toString().padStart(4))
            .join("<br>");

          const highlighted = Prism.highlight(
            outerHtml,
            Prism.languages[language],
            language,
          );
          span.innerHTML = highlighted;
        },
      ],
      beforeUnmount: [
        ...(h.beforeUnmount || []),
        // async () => {
        //   element.addEventListener("click", async () => {
        //     try {
        //       await navigator.clipboard.writeText(code.innerText);
        //       console.log("Copied to clipboard:", code.innerText);
        //     } catch (err) {
        //       console.log("Copy failed", navigator.clipboard);
        //     }
        //   });
        // },
      ],
    };
  },
};
