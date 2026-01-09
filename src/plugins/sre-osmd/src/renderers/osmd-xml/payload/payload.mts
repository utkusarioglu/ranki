import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
import { TAGS } from "../constants.mjs";
import css from "./payload.css?raw";
import { renderOsmd } from "../../common/osmd/render.mjs";

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: ({ ser }) => {
    const hs = AnkiUi.horizontalScroller();
    const div = document.createElement("div");
    div.style.width = "100%";
    hs.getMount!().appendChild(div);

    const xml = ser.source.trim();

    return {
      element: hs.element,
      css: [
        ...(hs.css || []),
        {
          id: "osmd",
          css,
        },
      ],
      afterMount: [
        ...(hs.afterMount || []),
        async () => {
          renderOsmd(div, xml);
        },
      ],
      beforeUnmount: [...(hs.beforeUnmount || [])],
    };
  },
};
