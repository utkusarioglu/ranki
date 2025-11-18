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
      tag: ["base", "v2", "paragraph", "block"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: async (t) => {
        assertTransformParent(t);
        const element = document.createElement("p");
        element.className = "base-v2-paragraph";

        const children = document.createElement("span");
        element.appendChild(children);

        return {
          element,
          slots: {
            children,
          },
          css: [
            {
              id: "base-v2-paragraph",
              css: `
                .base-v2-paragraph {
                  margin: 1em;
                  white-space: pre-wrap;
                }
              `.trim(),
            },
          ],
          // onLoad: () => {},
        };
      },
    },

    {
      tag: ["base", "v2", "line", "inline"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: async (t) => {
        assertTransformParent(t);
        const element = document.createDocumentFragment();
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
      tag: ["base", "v2", "lexeme", "inline"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: async (t) => {
        assertTransformParent(t);
        const element = document.createElement("span");
        element.className = "v2-base-lexeme";
        const children = document.createElement("span");
        element.appendChild(children);
        // element.appendChild(document.createElement("br"));

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
      tag: ["base", "v2", "nothing", "inline"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: async (t) => {
        assertTransformLeaf(t);
        return {
          element: document.createDocumentFragment(),
        };
      },
    },

    {
      tag: ["base", "v2", "ignored", "inline"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: async (t) => {
        assertTransformLeaf(t);
        const element = document.createElement("p");
        element.className = "base-v2-ignored";
        element.innerText = t.source.raw;
        // element.classList.add(t.creator);
        // element.classList.add("base-v2");

        return {
          element,
          css: [
            {
              id: "base-v2-ignored",
              css: `
                .base-v2-ignored {
                  margin: 1em;
                }
              `.trim(),
            },
          ],
          // onLoad: () => {},
        };
      },
    },

    {
      tag: ["base", "v2", "decorated_base", "inline"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: async (t) => {
        assertTransformParent(t);
        const element = document.createDocumentFragment();
        const children = document.createElement("span");
        element.appendChild(children);

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
      tag: ["base", "v2", "text", "generic", "inline"].join("."),
      engine: "vanilla-js",
      load: "static",
      // @ts-ignore
      renderer: async (t) => {
        assertTransformLeaf(t);
        // TODO this thing needs to be aware of the spaces
        const str = t.source.raw + " ";
        const element = document.createTextNode(str);

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
      tag: ["base", "v2", "number", "generic", "inline"].join("."),
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
      tag: "html.primitive.anchor.basic.container.inline",
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
        container.target = "_blank";
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
