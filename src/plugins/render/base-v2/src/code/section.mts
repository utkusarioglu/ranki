import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import Prism from "prismjs";
import "prismjs/components/prism-python.js";
import { css } from "./prism-atom-dark.css.mjs";
import section from "./section.css?raw";

export const codeSection: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const element = document.createElement("div");
  element.classList.add("ranki-code");
  const pre = document.createElement("pre");
  element.appendChild(pre);
  pre.style.paddingInline = "1em";
  pre.style.paddingBlock = "0.5em 0.5em";

  const code = document.createElement("code");
  pre.appendChild(code);
  const raw = t.source.raw.trim();
  const language = "python";
  const highlighted = Prism.highlight(raw, Prism.languages[language], language);
  code.innerHTML = highlighted;

  return {
    element,
    css: [
      {
        id: "prism-atom-dark",
        css,
      },
      {
        id: "ranki-code-section",
        css: section,
      },
    ].filter((v) => v),
    onLoad: [
      async () => {
        element.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(raw);
            console.log("Copied to clipboard:", raw);
          } catch (err) {
            console.log(navigator);
            alert("failed to copy");
            // console.error("Failed to copy:", err);
          }
        });
      },
    ],
  };
};
