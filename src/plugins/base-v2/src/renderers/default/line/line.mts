import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";

export const line: R = {
  chain: ["base", "v2", "line"],
  kind: "parent",
  sync: () => {
    const element = document.createElement("div");
    // element.className = "base-v2-paragraph";
    // element.classList.add("scheme-" + pref.scheme);
    return {
      element,
      getMount: () => element,
    };
  },
};
