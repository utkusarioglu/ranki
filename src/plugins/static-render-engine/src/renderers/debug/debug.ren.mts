import type { IDqmPluginRenderer, Assertions } from "@dqm/package-dqm-api-v2";

function randomColor(scheme: "light" | "dark") {
  const h = Math.random() * 360;
  const s = 60 + Math.random() * 20; // avoid gray/muted
  const l =
    scheme === "dark"
      ? 20 + Math.random() * 20 // 20–40%
      : 65 + Math.random() * 20; // 65–85%

  return `hsl(${h} ${s}% ${l}%)`;
}

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
      sync: (ser, pref, { parent }) => {
        const assertParent: Assertions["parent"] = parent;
        assertParent(ser, {});
        const element = document.createElement("div");
        element.classList.add("block-container");
        element.style.padding = "10px";
        element.style.backgroundColor =
          pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        element.style.border = `5px dotted ${randomColor(pref.scheme)}`;
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
      load: "sync",
      chain: ["debug", "leaf", "container"],
      sync: (ser, pref, { leaf }) => {
        const assertLeaf: Assertions["leaf"] = leaf;
        assertLeaf(ser, {});
        const element = document.createElement("div");
        element.classList.add("leaf-container");
        element.style.padding = "2px";
        element.style.backgroundColor =
          pref.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = pref.scheme === "dark" ? "#FFF" : "#000";
        element.style.border = `2px dotted ${randomColor(pref.scheme)}`;
        element.innerText = ser.source;
        return {
          element,
        };
      },
    },
    {
      load: "sync",
      chain: ["debug", "block", "container-2"],
      sync: (ser, pref, { leaf }) => {
        const assertLeaf: Assertions["leaf"] = leaf;
        assertLeaf(ser, {});
        const element = document.createElement("div");
        element.classList.add("container-2");
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
