import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import css from "./ignored.css?raw";

export const ignored: R = {
  chain: ["base", "v2", "ignored"],
  kind: "leaf",
  sync: ({ ser }) => {
    const element = document.createElement("div");
    element.classList.add("base-v2-ignored");
    element.innerText = ser.source;
    let children: HTMLDivElement;
    return {
      element,
      getMount: () => {
        if (!children) {
          children = document.createElement("div");
          element.appendChild(children);
        }
        return children;
      },
      css: [
        // #1
        {
          id: "base-v2-ignored",
          css,
        },
      ],
    };
  },
};
