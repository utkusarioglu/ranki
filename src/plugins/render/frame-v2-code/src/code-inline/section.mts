import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";

export const codeSection: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const element = document.createElement("span");

  // ANKI trim new lines
  const raw = t.source.raw.replace(/^[\r\n]+|[\r\n]+$/g, "").replace("\n", " ");
  element.innerText = raw;

  return {
    element,
    css: [],
    beforeUnmount: [],
    afterMount: [
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
