import type { RankiPluginRenderer } from "@ranki/package-render-v2";
// import { codeRenderer } from "./code/renderer.mjs";
import {
  assertTransformLeaf,
  assertTransformParent,
} from "@ranki/package-api-v2/helpers";

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
      renderer: async (t) => {
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
          // onLoad: () => {},
        };
      },
    },

    // this should be in a math plugin
    {
      tag: "eNotation",
      engine: "vanilla-js",
      load: "static",
      renderer: async (t) => {
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
          // onLoad: () => {},
        };
      },
    },

    {
      tag: "paragraph",
      engine: "vanilla-js",
      load: "static",
      renderer: async (t) => {
        assertTransformParent(t);
        const element = document.createElement("p");
        element.style.marginBlock = "1em";
        element.classList.add(t.creator);
        element.classList.add("base-v2");

        const children = document.createElement("span");
        element.appendChild(children);
        // element.appendChild(document.createTextNode("p"));

        return {
          element,
          slots: {
            children,
          },
          // onLoad: () => {},
        };
      },
    },

    {
      tag: "base.v2.line",
      engine: "vanilla-js",
      load: "static",
      renderer: async (t) => {
        assertTransformParent(t);
        const element = document.createElement("div");
        element.classList.add(t.creator);
        element.classList.add("base-v2");

        const children = document.createElement("span");
        element.appendChild(children);
        element.appendChild(document.createElement("br"));

        return {
          element,
          slots: {
            children,
          },
          // onLoad: () => {},
        };
      },
    },

    {
      tag: "base.v2.decorated_base",
      engine: "vanilla-js",
      load: "static",
      renderer: async (t) => {
        assertTransformParent(t);
        const element = document.createDocumentFragment();
        const children = document.createElement("span");
        element.appendChild(children);
        // element.classList.add(t.creator);
        // element.classList.add("base-v2");

        return {
          element,
          slots: {
            children,
          },
          // onLoad: () => {},
        };
      },
    },

    {
      tag: "base.v2.word_base",
      engine: "vanilla-js",
      load: "static",
      // @ts-ignore
      renderer: async (t) => {
        assertTransformLeaf(t);
        // TODO this thing needs to be aware of the spaces
        const str = t.source.raw + " ";
        const element = document.createTextNode(str);
        // element.classList.add(t.creator);
        // element.classList.add("base-v2");
        // element.innerText = t.source.raw;

        return {
          element,
          // slots: {
          //   children: element,
          // },
          // onLoad: () => {},
        };
      },
    },

    {
      tag: "base.v2.word_number",
      engine: "vanilla-js",
      load: "static",
      // @ts-ignore
      renderer: async (t) => {
        assertTransformLeaf(t);
        const element = document.createDocumentFragment();
        const number = document.createElement("span");
        element.appendChild(number);
        number.classList.add("base-v2-number");
        number.innerText = t.source.raw;
        // TODO this thing needs to be aware of the spaces
        element.appendChild(document.createTextNode(" "));

        return {
          element,
          css: [
            {
              id: "base.v2.word_number",
              css: `
              .base-v2-number {
                color: red;
              }
            `,
            },
          ],
          // slots: {
          //   children: element,
          // },
          // onLoad: () => {},
        };
      },
    },

    {
      tag: "html.primitive.anchor.basic.container",
      engine: "vanilla-js",
      load: "static",
      renderer: async (t) => {
        assertTransformParent(t);

        const values = t.params
          .filter(({ key }) => key === "positional")
          .filter(({ type }) => type === "setting")[0].values;
        if (values.length > 1) {
          throw new Error("Single value expected");
        }
        const href = values[0].raw;

        const container = document.createElement("a");
        container.href = href;
        const children = document.createElement("span");
        container.appendChild(children);

        return {
          element: container,
          slots: {
            children,
          },
          // onLoad: () => {},
        };
      },
    },
  ],
};
