import { assertTransformLeaf } from "@ranki/package-api-v2/helpers";
import type { RankiRenderPluginItemRenderFunction } from "@ranki/package-render-v2";
// import css from "./section.css?raw";
// import { AnkiUi } from "@ranki/package-anki-ui";
import mermaid, { type MermaidConfig } from "mermaid";

// export interface MermaidConfig {
//   theme: string;
//   themeVariables: Record<string, any>;
// }

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

export const mermaidSection: RankiRenderPluginItemRenderFunction = async (
  t,
) => {
  assertTransformLeaf(t);
  const element = document.createElement("div");
  element.classList.add("mermaid-block");
  const id = "SomeId";
  element.id = id;

  const raw = t.source.raw.trim();

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
};
