import { type RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import { assertTransformParent } from "@ranki/package-api-v2/helpers";
import { AnkiUi } from "@ranki/package-anki-ui";
// import css from "./container.css?raw";

export const mermaidContainer: RankiRenderPluginItemRenderFunction = async (
  t,
  _options,
) => {
  assertTransformParent(t);
  const block = AnkiUi.titledBlock([
    {
      type: "programming-language",
      text: "Flowchart",
    },
  ]);

  return {
    element: block.element,
    slots: block.slots,
    css: [
      // {
      //   id: "latex-block-sections-container",
      //   css,
      // },
      ...block.css!,
    ],
    onLoad: [
      async () => {
        // await new Promise((r) => setTimeout(r, 1e3));
        let val = 0;
        const grow = () => {
          (block.element as HTMLElement).style.opacity = val.toString();
          val += 0.01;
          if (val < 1) {
            window.requestAnimationFrame(grow);
          }
        };
        window.requestAnimationFrame(grow);
      },
    ],
  };
};
