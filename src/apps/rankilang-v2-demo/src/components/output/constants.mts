import type { TabDefinition } from "./Output";

export const tabs: TabDefinition[] = [
  {
    type: "exact",
    name: "Render",
    format: "render",
    path: "",
  },
  {
    type: "exact",
    format: "yaml",
    name: "All",
    path: "",
  },
  {
    type: "exact",
    format: "yaml",
    name: "Report",
    path: "report",
  },
  {
    type: "exact",
    format: "yaml",
    name: "Config",
    path: "report.config",
  },
  {
    type: "exact",
    format: "yaml",
    name: "Stages",
    path: "theaters.default.stages",
  },
  {
    type: "exact",
    format: "yaml",
    name: "Block",
    path: "theaters.default.stages.ast.root.children.0.children.",
  },
  {
    type: "exact",
    format: "yaml",
    name: "Lexeme",
    path: "theaters.default.stages.ast.root.children.0.children.0.children.0.children.0.children.",
  },
  {
    type: "custom",
    format: "yaml",
    name: "Custom",
    path: "",
  },
];
