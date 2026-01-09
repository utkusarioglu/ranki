import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
import { TAGS } from "../constants.mjs";

import css from "./payload.css?raw";
import yaml from "yaml";
import { toXML } from "jstoxml";
import { renderOsmd } from "../../common/osmd/render.mjs";

// tag: [...commonTags, "section", "block"].join("."),

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: ({ ser }) => {
    const hs = AnkiUi.horizontalScroller();
    const div = document.createElement("div");
    div.style.width = "100%";
    hs.getMount!().appendChild(div);
    const raw = ser.source.trim();

    const o = yaml.parse(raw);
    const xml = toXML(o, { header: true });

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
