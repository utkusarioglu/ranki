import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
import { renderOsmd } from "../../common/osmd/render.mjs";
import css from "./section.css?raw";

export const section: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const hs = AnkiUi.horizontalScroller();
  const div = document.createElement("div");
  div.style.width = "100%";
  hs.slots!.content.appendChild(div);

  const xml = t.source.raw.trim();

  return {
    element: hs.element,
    css: [
      {
        id: "osmd",
        css,
      },
      ...hs.css!,
    ],
    afterMount: [
      async () => {
        renderOsmd(div, xml);
      },
    ],
    beforeUnmount: [async () => {}],
  };
};
