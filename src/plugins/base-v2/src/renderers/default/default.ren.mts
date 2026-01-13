import type { IDqmPluginRenderer } from "@dqm/package-dqm-api-v2";
import { paragraph } from "./paragraph/paragraph.mjs";
import { ignored } from "./ignored/ignored.mjs";

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
    ignored,
    {
      chain: ["base", "v2", "section"],
      kind: "parent",
      sync: () => {
        const element = document.createElement("section");
        return {
          element,
          getMount: () => element,
        };
      },
    },
    {
      chain: ["base", "v2", "line"],
      kind: "parent",
      sync: () => {
        const element = document.createElement("div");
        element.className = "line";
        // pref.scheme === "dark" ? "#000" : "#FFF";
        // element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        return {
          element,
          getMount: () => element,
        };
      },
    },
    {
      chain: ["base", "v2", "lexeme"],
      kind: "parent",
      sync: () => {
        const element = document.createElement("span");
        element.className = "lexeme";
        // pref.scheme === "dark" ? "#000" : "#FFF";
        // element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        return {
          element,
          getMount: () => element,
        };
      },
    },
    {
      chain: ["base", "v2", "decorated"],
      kind: "parent",
      sync: () => {
        const element = document.createElement("span");
        element.className = "decorated";
        // pref.scheme === "dark" ? "#000" : "#FFF";
        // element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        return {
          element,
          getMount: () => element,
        };
      },
    },

    {
      chain: ["base", "v2", "word"],
      kind: "leaf",
      sync: ({ ser }) => {
        const element = document.createElement("span");
        element.className = "word";
        // pref.scheme === "dark" ? "#000" : "#FFF";
        // element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        element.innerText = ser.source;
        return {
          element,
          getMount: () => element,
        };
      },
    },
    {
      chain: ["base", "v2", "number"],
      kind: "leaf",
      sync: ({ ser }) => {
        const element = document.createElement("span");
        element.className = "number";
        // pref.scheme === "dark" ? "#000" : "#FFF";
        // element.style.color = pref.scheme === "dark" ? "#F00" : "#00F";
        element.innerText = ser.source;
        return {
          element,
          // getMount: () => element,
        };
      },
    },
    {
      chain: ["base", "v2", "whitespace"],
      kind: "leaf",
      sync: ({ ser }) => {
        const element = document.createElement("span");
        element.className = "whitespace";
        // pref.scheme === "dark" ? "#000" : "#FFF";
        // element.style.color = pref.scheme === "dark" ? "#F00" : "#00F";
        element.innerText = ser.source;
        return {
          element,
          getMount: () => element,
        };
      },
    },
  ],
};
