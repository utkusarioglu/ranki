import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { TAGS } from "../constants.mjs";
import mermaid, { type MermaidConfig } from "mermaid";

const mermaidConfig: MermaidConfig = {
  theme: "base",
  themeVariables: {
    // fontSize: "8px",
    // primaryColor: "#BB2528",
    primaryColor: "#444",
    // primaryTextColor: "#fff",
    primaryTextColor: "#ddd",
    primaryBorderColor: "#7C0000",
    lineColor: "#F8B229",
    secondaryColor: "#006100",
    tertiaryColor: "#fff",
  },
};

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: ({ ser }) => {
    const element = document.createElement("div");
    element.classList.add("mermaid-block");
    const id = ser.source.length.toString();
    element.id = id;
    const raw = ser.source.trim();

    return {
      element,
      afterMount: [
        async () => {
          mermaid.initialize({ startOnLoad: false, ...mermaidConfig });
          const { svg } = await mermaid.render(id, raw);
          element.innerHTML = svg;
        },
      ],
    };
  },
};
