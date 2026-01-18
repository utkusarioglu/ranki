import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";

export const whitespace: R = {
  chain: ["base", "v2", "whitespace"],
  kind: "leaf",
  sync: ({ ser }) => {
    const element = document.createElement("span");
    element.className = "base-v2-whitespace";
    // element.className = "base-v2-paragraph";
    // element.classList.add("scheme-" + pref.scheme);
    element.innerText = ser.source;
    return {
      element,
      getMount: () => element,
    };
  },
};
