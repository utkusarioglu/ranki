import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
import css from "./section.css?raw";
import yaml from "yaml";
import { toXML } from "jstoxml";
import { renderOsmd } from "../../common/osmd/render.mjs";

export const section: RankiRenderPluginItemRenderFunction = async (t) => {
  assertTransformLeaf(t);
  const hs = AnkiUi.horizontalScroller();
  const div = document.createElement("div");
  div.style.width = "100%";
  hs.slots.children.appendChild(div);
  const raw = t.source.raw.trim();

  const o = yaml.parse(raw);
  const xml = toXML(o, { header: true });

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
      ...hs.afterMount,
      async () => {
        renderOsmd(div, xml);
      },
    ],
    beforeUnmount: [...hs.beforeUnmount],
  };
};
