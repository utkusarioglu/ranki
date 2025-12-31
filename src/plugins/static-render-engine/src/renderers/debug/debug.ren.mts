import type { IDqmPluginRenderer } from "@dqm/package-dqm-api-v2";

export const debugRenderer: IDqmPluginRenderer = {
  type: "renderer",
  meta: {
    name: "Debug",
    engine: "DqmStaticRenderer",
    description:
      "Provides easily discernable structures for debugging rendering issues",
    version: "0.0.0",
  },
  list: [
    {
      load: "sync",
      chain: ["debug", "block", "container"],
      sync: (t, o) => {
        const element = document.createElement("div");
        switch (t.kind) {
          case "leaf":
            element.innerText = t.source + " " + o.scheme;
            break;
          case "parent":
            element.innerText = "is parent" + o.scheme + "|";
            break;
        }
        return {
          element,
        };
      },
    },
  ],
};
