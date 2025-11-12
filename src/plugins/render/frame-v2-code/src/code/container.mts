import { type RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import { assertTransformParent } from "@ranki/package-api-v2/helpers";
import css from "./container.css?raw";
import { TEMPgetLanguageName } from "./TEMPgetLanguageName.mjs";
import { AnkiUi } from "@ranki/package-anki-ui";

export const codeContainer: RankiRenderPluginItemRenderFunction = async (
  t,
  options,
) => {
  assertTransformParent(t);
  const langName = TEMPgetLanguageName(t);

  const block = AnkiUi.titledBlock([
    {
      type: "programming-language",
      text: langName,
    },
    {
      type: "file-path",
      text: "c:/cat/dog.file",
    },
    {
      type: "ha",
      text: options.scheme,
    },
  ]);
  const children = document.createElement("div");
  block.slots!.children.appendChild(children);

  return {
    element: block.element,
    slots: {
      children,
    },
    css: [
      {
        id: "code-block-container",
        css,
      },
      ...block.css!,
    ],
    onLoad: [
      async () => {
        await new Promise((r) => setTimeout(r, 1e3));
        let val = 0;
        const grow = () => {
          val += 0.03;
          (block.element as HTMLElement).style.opacity = val.toString();
          if (val < 1) {
            window.requestAnimationFrame(grow);
          }
        };
        window.requestAnimationFrame(grow);
      },
    ],
  };
};
