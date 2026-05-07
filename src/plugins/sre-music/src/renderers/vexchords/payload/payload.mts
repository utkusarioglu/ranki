import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
import { TAGS } from "../constants.mjs";

// tag: [...commonTags, "section", "block"].join("."),

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  // @ts-expect-error
  sync: ({ ser }) => {
    const hs = AnkiUi.horizontalScroller();

    return {
      element: hs.element,
      css: [...(hs.css || [])],
      afterMount: [
        ...(hs.afterMount || []),
        async () => {
          const chord = await import("./chord.mjs");
          chord.drawChord(hs.getMount!());
        },
      ],
      beforeUnmount: [...(hs.beforeUnmount || [])],
    };
  },
};
