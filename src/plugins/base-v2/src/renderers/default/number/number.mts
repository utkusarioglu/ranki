import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";

export const number: R = {
  chain: ["base", "v2", "number"],
  kind: "leaf",
  sync: ({ ser }) => {
    const element = document.createElement("span");
    element.className = "base-v2-number";
    // element.className = "base-v2-paragraph";
    // element.classList.add("scheme-" + pref.scheme);
    element.innerText = ser.source;
    return {
      element,
      getMount: () => element,
    };
  },
};
