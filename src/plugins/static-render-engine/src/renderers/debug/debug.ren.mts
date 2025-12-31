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
      sync: (t, o, { leaf }) => {
        const assertLeaf: Assertions["leaf"] = leaf;
        assertLeaf(t);
        const element = document.createElement("div");
        element.style.padding = "10px";
        element.style.backgroundColor = o.scheme === "dark" ? "#000" : "#FFF";
        element.style.color = o.scheme === "dark" ? "#FFF" : "#000";
        element.style.border = `2px dotted ${randomColor(o.scheme)}`;
        element.innerText = t.source;
        return {
          element,
        };
      },
    },
  ],
};
