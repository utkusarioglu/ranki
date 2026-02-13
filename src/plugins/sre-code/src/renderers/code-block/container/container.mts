import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { AnkiUi } from "@ranki/package-anki-ui";
import { NO_LANGUAGE, TAGS } from "../constants.mjs";
// import css from "./container.css?raw";

export const container: R = {
  chain: [...TAGS, "container", "block"],
  kind: "parent",
  sync: ({ ser }) => {
    const def = ser.props.component?.default;
    const rawName = def.language.name;
    const displayNames = def.language.displayNames;
    let displayName = NO_LANGUAGE;
    if (rawName) {
      displayName = rawName;
    }
    if (displayNames[rawName]) {
      displayName = displayNames[rawName];
    }

    const block = AnkiUi.titledBlock([
      {
        type: "programming-language",
        text: displayName,
      },
      // {
      //   type: "file-path",
      //   text: "c:/cat/dog.file",
      // },
      // {
      //   type: "ha",
      //   text: pref.scheme,
      // },
    ]);

    return {
      element: block.element,
      getMount: () => block.getMount!(),
      // slots: block.slots,
      css: [
        // {
        //   id: "latex-block-sections-container",
        //   css,
        // },
        ...block.css!,
      ],
      afterMount: [
        // async () => {
        //   // await new Promise((r) => setTimeout(r, 1e3));
        //   let val = 0;
        //   const grow = () => {
        //     (block.element as HTMLElement).style.opacity = val.toString();
        //     val += 0.01;
        //     if (val < 1) {
        //       window.requestAnimationFrame(grow);
        //     }
        //   };
        //   window.requestAnimationFrame(grow);
        // },
      ],
    };
  },
};
