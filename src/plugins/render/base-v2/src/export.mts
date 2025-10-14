import type { RankiPluginRenderer } from "@ranki/package-render-v2";

export const renderPluginBaseV2Render: RankiPluginRenderer = {
  type: "renderer",
  meta: {
    name: "BaseV2Render",
    version: "0.0.0",
  },
  items: [
    {
      tag: "span",
      engine: "html",
      load: "static",
      renderer: (t) => {
        if (t.kind === "parent") {
          throw new Error("span ELEMENT CANNOT BE A PARENT");
        }
        const element = document.createElement("span");
        switch (t.source.type) {
          case "number":
            element.innerText = t.source.number.toString();
            break;
          default:
            element.innerText = t.source.raw;
        }
        return {
          element,
          loadedCallback: () => {},
        };
      },
    },
  ],
};
