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
          onLoad: () => {},
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
          onLoad: () => {},
        };
      },
    },

    {
      tag: "code",
      engine: "vanilla-js",
      load: "lazy",
      renderer: () => import("./code/renderer.mjs").then((i) => i.codeRenderer),
      // renderer: async () => (t) => {
      //   if (t.kind === "parent") {
      //     throw new Error("E_NOTATION CANNOT BE A PARENT");
      //   }

      //   const container = document.createElement("div");
      //   container.style.border = "1px solid gray";
      //   container.style.padding = "1em";

      //   const hud = document.createElement("div");
      //   const langName = document.createElement("span");
      //   langName.innerText = "js";
      //   hud.style.backgroundColor = "gray";
      //   hud.style.paddingInline = "1em";
      //   hud.style.paddingBlock = "0.5em";
      //   hud.appendChild(langName);
      //   container.appendChild(hud);

      //   const pre = document.createElement("pre");
      //   container.appendChild(pre);
      //   const code = document.createElement("code");
      //   pre.appendChild(code);
      //   code.innerText = t.source.raw;

      //   return {
      //     element: container,
      //     onLoad: () => {},
      //   };
      // },
    },

    {
      tag: "div",
      engine: "vanilla-js",
      load: "static",
      renderer: (t) => {
        if (t.kind !== "parent") {
          throw new Error("DIV KIND HAS TO BE A PARENT");
        }
        const container = document.createElement("div");
        container.style.paddingLeft = "0.5em";
        container.style.borderLeft = "1px solid gray";
        const children = document.createElement("div");
        container.className = "div-container";
        container.appendChild(children);
        return {
          element: container,
          slots: {
            children,
          },
          onLoad: () => {},
        };
      },
    },

    {
      tag: "paragraph",
      engine: "vanilla-js",
      load: "static",
      renderer: (t) => {
        if (t.kind !== "leaf") {
          throw new Error("PARAGRAPH HAS TO BE A LEAF");
        }
        const element = document.createElement("p");
        element.classList.add(t.creator);
        element.innerText = t.source.raw;

        return {
          element,
          slots: {
            children: element,
          },
          onLoad: () => {},
        };
      },
    },

    {
      tag: "anchor",
      engine: "vanilla-js",
      load: "static",
      renderer: (t) => {
        if (t.kind === "parent") {
          throw new Error("Anchor CANNOT BE A PARENT");
        }

        const container = document.createElement("a");
        container.target = "_blank";
        container.href = "https://www.google.com";
        container.innerText = t.source.raw;

        return {
          element: container,
          onLoad: () => {},
        };
      },
    },
  ],
};
