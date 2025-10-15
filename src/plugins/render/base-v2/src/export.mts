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
      engine: "vanilla-js",
      load: "static",
      renderer: (t) => {
        if (t.kind === "parent") {
          throw new Error("span ELEMENT CANNOT BE A PARENT");
        }
        const element = document.createElement("span");
        if (t.print) {
          switch (t.source.type) {
            case "number":
              element.innerText = t.source.number.toString();
              break;
            default:
              element.innerText = t.source.raw;
          }
        }
        return {
          element,
          loadedCallback: () => {},
        };
      },
    },

    // this should be in a math plugin
    {
      tag: "eNotation",
      engine: "vanilla-js",
      load: "static",
      renderer: (t) => {
        if (t.kind === "parent") {
          throw new Error("E_NOTATION CANNOT BE A PARENT");
        }
        const container = document.createElement("span");
        const base = document.createElement("span");

        // TODO rich number types need to be cast to these
        // @ts-expect-error
        base.innerText = t.source.significand.raw;
        container.appendChild(base);

        const mid = document.createElement("span");
        mid.innerText = " × 10";
        container.appendChild(mid);

        const exponent = document.createElement("sup");
        // TODO rich number types need to be cast to these
        // @ts-expect-error
        exponent.innerText = t.source.exponent.raw;
        container.appendChild(exponent);

        return {
          element: container,
          loadedCallback: () => {},
        };
      },
    },
  ],
};
