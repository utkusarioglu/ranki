import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";

export const lexeme: R = {
  chain: ["base", "v2", "lexeme"],
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
