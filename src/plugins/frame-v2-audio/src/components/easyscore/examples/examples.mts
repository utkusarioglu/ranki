import type { IDqmPluginExamples } from "@dqm/package-dqm-api-v2";
import twoLines from "./2-lines.dqm?raw";

export const examples: IDqmPluginExamples = [
  {
    title: "EasyScore",
    description: "Basic EasyScore content",
    inputs: [
      {
        theater: "A",
        dqm: twoLines,
      },
    ],
  },
];
