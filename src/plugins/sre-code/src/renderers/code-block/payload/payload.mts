import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
import { NO_LANGUAGE, TAGS } from "../constants.mjs";
import css from "./payload.css?raw";
import Prism from "./prism/prism.mjs";
import prismCss from "./prism/prism-atom-dark.css?raw";

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: ({ ser }) => {
    const element = document.createElement("div");
    element.classList.add("code-block");
    const h = AnkiUi.horizontalScroller();
    element.appendChild(h.element);
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    pre.appendChild(code);
    h.getMount!().appendChild(pre);
    const span = document.createElement("span");
    code.appendChild(span);
    const left = h.subtree!.left();

    const def = ser.props.component?.default;
    const rawName = def.language.name;
    const raw = ser.source.replace(/^[\r\n]+|[\r\n]+$/g, "");

    left.innerHTML = Array(raw.split("\n").length)
      .fill(null)
      .map((_, i) => (i + 1).toString().padStart(3, " "))
      .join("<br>");

    const highlighted =
      rawName === NO_LANGUAGE
        ? raw
        : Prism.highlight(raw, Prism.languages[rawName], rawName);
    span.innerHTML = highlighted;
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
      afterMount: [...(h.afterMount || [])],
      beforeUnmount: [
        ...(h.beforeUnmount || []),
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
  },
};
