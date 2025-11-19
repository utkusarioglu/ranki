import { assertTransformParent } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";

export const section: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformParent(t);
  const element = document.createElement("code");
  const children = document.createElement("span");
  element.appendChild(children);

  // // ANKI trim new lines
  // const raw = t.source.raw.replace(/^[\r\n]+|[\r\n]+$/g, "").replace("\n", " ");
  // element.innerText = raw;

  return {
    element,
    slots: {
      children,
    },
    css: [],
    beforeUnmount: [],
    afterMount: [
      async () => {
        element.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(element.innerText);
            console.log("Copied to clipboard:", element.innerText);
          } catch (err) {
            console.log("Copy failed", navigator.clipboard);
          }
        });
      },
    ],
  };
};
