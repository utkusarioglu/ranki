import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import css from "./section.css?raw";

export const section: R = {
  chain: ["base", "v2", "section"],
  kind: "parent",
  sync: () => {
    const element = document.createElement("section");
    element.classList.add("dqm-v2");
    element.classList.add("dqm-v2-section");
    return {
      element,
      getMount: () => element,
      css: [
        {
          id: "base-v2-section",
          css,
        },
      ],
    };
  },
};
