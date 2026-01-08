import type {
  Assertions,
  IDqmRenderPluginRenderer as R,
} from "@dqm/package-dqm-api-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
import { TAGS } from "../constants.mjs";

export const container: R = {
  chain: [...TAGS, "container", "block"],
  sync: (ser, _pref, { parent }) => {
    const assertKind: Assertions["parent"] = parent;
    assertKind(ser, {});
    const block = AnkiUi.titledBlock([
      {
        type: "programming-language",
        text: "Score",
      },
    ]);

    return {
      element: block.element,
      getMount: () => block.getMount!(),
      css: [
        // {
        //   id: "latex-block-sections-container",
        //   css,
        // },
        ...block.css!,
      ],
      afterMount: [
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
  },
};
