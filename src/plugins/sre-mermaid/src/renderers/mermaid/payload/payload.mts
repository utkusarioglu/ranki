import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { TAGS } from "../constants.mjs";
import { type MermaidConfig } from "mermaid";
import css from "./payload.css?raw";

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
    element.innerHTML = "Loading mermaid...";
    const id = "mermaid-" + ser.source.length.toString();
    element.id = id;
    const p = new DOMParser();
    const doc = p.parseFromString(ser.source, "text/html");
    const raw = doc.body.textContent;
    // const raw = ser.source;

    return {
      element,
      css: [
        {
          id: "mermaid-block",
          css,
        },
      ],
      afterMount: [
        async () => {
          try {
            const mermaid = await (await import("mermaid")).default;
            // await new Promise<void>((r) => setTimeout(r, 2000));
            // mermaid.initialize({
            //   startOnLoad: false,
            //   securityLevel: "loose",
            //   ...mermaidConfig,
            // });
            // const { svg } = await mermaid.render(id, raw);
            // console.log("svg", svg);
            // element.innerHTML = svg;
            mermaid.initialize({
              startOnLoad: false,
              securityLevel: "strict",
              deterministicIds: true,

              // CRITICAL for v11
              htmlLabels: false,

              flowchart: {
                htmlLabels: false,
                useMaxWidth: false,
              },

              sequence: {
                // @ts-expect-error
                htmlLabels: false,
                useMaxWidth: false,
              },

              gantt: {
                useMaxWidth: false,
              },

              // Reduce internal observers
              maxTextSize: 100_000,
              ...mermaidConfig,
            });

            const { svg: svgString } = await mermaid.render(
              `mmd-${Date.now()}`,
              raw,
              undefined,
              // @ts-expect-error
              element, // IMPORTANT in v11
            );
            // svg.setAttribute("viewBox", `0 0 ${vb.width} ${vb.height}`);
            element.innerHTML = svgString;
          } catch (e) {
            element.innerHTML = "Something went wrong with Mermaid";
            console.error(e);
          }
        },
      ],
    };
  },
};
