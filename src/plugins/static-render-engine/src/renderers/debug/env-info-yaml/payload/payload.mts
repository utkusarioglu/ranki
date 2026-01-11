import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
import { TAGS } from "../constants.mjs";
import css from "./payload.css?raw";
import Prism from "prismjs";
import yaml from "yaml";
import "prismjs/components/prism-yaml.js";
import prismCss from "./prism/prism-atom-dark.css?raw";
import { collectEnvironmentInfo } from "./collect.mjs";

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: ({ pref }) => {
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

          const language = "yaml";
          const envInfo = await collectEnvironmentInfo();
          const raw = {
            pref,
            envInfo,
          };
          const stringified = yaml.stringify(raw);

          const highlighted = Prism.highlight(
            stringified,
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
