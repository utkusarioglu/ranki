import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import css from "./paragraph.css?raw";

export const paragraph: R = {
  chain: ["base", "v2", "paragraph"],
  kind: "parent",
  sync: ({ pref }) => {
    const element = document.createElement("p");
    element.classList.add("base-v2-paragraph");
    element.classList.add("scheme-" + pref.scheme);
    return {
      element,
      getMount: () => element,
      css: [
        {
          id: "base-v2-paragraph",
          css,
        },
      ],
    };
  },
};
