import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";

export const decorated: R = {
  chain: ["base", "v2", "decorated"],
  kind: "parent",
  sync: () => {
    const element = document.createElement("span");
    // element.className = "base-v2-paragraph";
    // element.classList.add("scheme-" + pref.scheme);
    return {
      element,
      getMount: () => element,
    };
  },
};
