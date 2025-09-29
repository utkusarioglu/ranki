import type { TabDefinition } from "./Output";

export const tabs: TabDefinition[] = [
  {
    type: "exact",
    name: "All",
    path: "",
  },
  {
    type: "exact",
    name: "Report",
    path: "report",
  },
  {
    type: "exact",
    name: "Config",
    path: "report.config",
  },
  {
    type: "exact",
    name: "Raw",
    path: "stages.raw",
  },
  {
    type: "exact",
    name: "Root",
    path: "stages.parse.root",
  },
  {
    type: "exact",
    name: "Block",
    path: "stages.parse.root.children.children.",
  },
  {
    type: "exact",
    name: "Lexeme",
    path: "stages.parse.root.children.children.0.children.0.children.0.children.",
  },
  {
    type: "custom",
    name: "Custom",
    path: "",
  },
];
