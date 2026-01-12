import type { IDqmPluginComponentSet } from "@dqm/package-dqm-api-v2";
import { frameV2MermaidComponent } from "./mermaid/mermaid.mjs";
import { frameV2FlowchartTbComponent } from "./flowchart-tb/flowchart-tb.mjs";
import { frameV2FlowchartLrComponent } from "./flowchart-lr/flowchart-lr.mjs";

export const frameV2Mermaid: IDqmPluginComponentSet = {
  type: "component-set",
  meta: {
    name: "FrameV2:Mermaid",
    version: "0.0.0",
    description: "Mermaid charts",
  },
  list: [
    frameV2MermaidComponent,
    frameV2FlowchartTbComponent,
    frameV2FlowchartLrComponent,
  ],
};
