import type { IDqmPluginRenderer, Assertions } from "@dqm/package-dqm-api-v2";
import { randomColor } from "./randomColor.mjs";
import { debugPayloadBlock } from "./debug-payload-block/container.ren.mjs";

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
    debugPayloadBlock,
    {
      // load: "sync",
      chain: ["debug", "container", "block"],
      sync: (ser, pref, { parent }) => {
        const assertParent: Assertions["parent"] = parent;
        assertParent(ser, {});
        const element = document.createElement("div");
        element.classList.add("debug-container-block");
        element.style.padding = "10px";
        element.style.backgroundColor =
          pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        element.style.border = `5px dotted ${randomColor(pref.scheme)}`;
        element.style.marginBlock = "1em";
        element.addEventListener("mouseenter", () => {
          element.style.borderStyle = "solid";
        });
        element.addEventListener("mouseleave", () => {
          element.style.borderStyle = "dotted";
        });
        element.addEventListener("click", (e) => {
          e.stopPropagation();
          console.log(ser);
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
      // load: "sync",
      chain: ["debug", "container", "inline"],
      sync: (ser, pref, { parent }) => {
        const assertParent: Assertions["parent"] = parent;
        assertParent(ser, {});
        const element = document.createElement("span");
        element.classList.add("debug-container-inline");
        element.style.paddingInline = "10px";
        element.style.backgroundColor =
          pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        element.style.border = `5px dotted ${randomColor(pref.scheme)}`;
        element.style.marginBlock = "1em";
        element.addEventListener("mouseenter", () => {
          element.style.borderStyle = "solid";
        });
        element.addEventListener("mouseleave", () => {
          element.style.borderStyle = "dotted";
        });
        element.addEventListener("click", (e) => {
          e.stopPropagation();
          console.log(ser);
        });
        let children: HTMLSpanElement;
        return {
          element,
          getMount: () => {
            if (!children) {
              children = document.createElement("span");
              element.appendChild(children);
            }
            return children;
          },
        };
      },
    },

    // {},

    {
      // load: "sync",
      chain: ["debug", "payload", "inline"],
      sync: (ser, pref, { leaf }) => {
        const assertLeaf: Assertions["leaf"] = leaf;
        assertLeaf(ser, {});
        const element = document.createElement("span");
        element.classList.add("debug-payload-inline");
        element.style.padding = "2px";
        element.style.backgroundColor =
          pref.scheme === "dark"
            ? "linear-gradient(#00F, #FFF)"
            : "linear-gradient(#FF0, #000)";
        element.style.color = pref.scheme === "dark" ? "#FF0" : "#00f";
        element.style.border = `2px dotted ${randomColor(pref.scheme)}`;
        element.innerText = ser.source;
        return {
          element,
        };
      },
    },
  ],
};
