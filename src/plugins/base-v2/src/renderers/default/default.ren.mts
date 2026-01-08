import type { IDqmPluginRenderer } from "@dqm/package-dqm-api-v2";
import { paragraph } from "./paragraph/paragraph.mjs";

export const baseV2Renderer: IDqmPluginRenderer = {
  type: "renderer",
  meta: {
    name: "BaseV2",
    engine: "DqmStaticRenderer",
    description: "Provides some signature elements for BaseV2",
    version: "0.0.0",
  },
  list: [
    paragraph,
    {
      chain: ["base", "v2", "ignored"],
      kind: "leaf",
      sync: ({ trn, pref }) => {
        const element = document.createElement("div");
        element.style.padding = "10px";
        element.style.backgroundColor =
          pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        element.innerText = trn.source;
        element.addEventListener("click", (e) => {
          e.stopPropagation();
          console.log(trn);
        });
        let children: HTMLDivElement;
        return {
          element,
          getMount: () => {
            if (!children) {
              children = document.createElement("div");
              element.appendChild(children);
            }
            return children;
          },
        };
      },
    },
    {
      chain: ["base", "v2", "section"],
      kind: "parent",
      sync: ({ pref }) => {
        const element = document.createElement("section");
        pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        return {
          element,
          getMount: () => element,
        };
      },
    },
    // {
    //   chain: ["base", "v2", "paragraph"],
    //   sync: (ser, pref, { parent }) => {
    //     const assertKind: Assertions["parent"] = parent;
    //     assertKind(ser, {});
    //     const element = document.createElement("p");
    //     pref.scheme === "dark" ? "#000" : "#FFF";
    //     element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
    //     return {
    //       element,
    //       getMount: () => element,
    //     };
    //   },
    // },
    {
      chain: ["base", "v2", "line"],
      kind: "parent",
      sync: ({ pref }) => {
        const element = document.createElement("div");
        element.className = "line";
        pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        return {
          element,
          getMount: () => element,
        };
      },
    },
    {
      chain: ["base", "v2", "lexeme"],
      kind: "parent",
      sync: ({ pref }) => {
        const element = document.createElement("span");
        element.className = "lexeme";
        pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        return {
          element,
          getMount: () => element,
        };
      },
    },
    {
      chain: ["base", "v2", "decorated"],
      kind: "parent",
      sync: ({ pref }) => {
        const element = document.createElement("span");
        element.className = "decorated";
        pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        return {
          element,
          getMount: () => element,
        };
      },
    },

    {
      chain: ["base", "v2", "word"],
      kind: "leaf",
      sync: ({ trn, pref }) => {
        const element = document.createElement("span");
        element.className = "word";
        pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        element.innerText = trn.source;
        return {
          element,
          getMount: () => element,
        };
      },
    },
    {
      chain: ["base", "v2", "number"],
      kind: "leaf",
      sync: ({ trn, pref }) => {
        const element = document.createElement("span");
        element.className = "number";
        pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#F00" : "#00F";
        element.innerText = trn.source;
        return {
          element,
          getMount: () => element,
        };
      },
    },
    {
      chain: ["base", "v2", "whitespace"],
      kind: "leaf",
      sync: ({ trn, pref }) => {
        const element = document.createElement("span");
        element.className = "whitespace";
        pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#F00" : "#00F";
        element.innerText = trn.source;
        return {
          element,
          getMount: () => element,
        };
      },
    },
  ],
};
