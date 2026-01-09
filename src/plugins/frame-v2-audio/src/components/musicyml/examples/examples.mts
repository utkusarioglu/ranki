import type { IDqmPluginExamples } from "@dqm/package-dqm-api-v2";
import score from "./score.dqm?raw";
import tab from "./tab.dqm?raw";

export const examples: IDqmPluginExamples = [
  {
    title: "Tab",
    description: "Simple Osmd tab",
    inputs: [
      {
        theater: "A",
        dqm: tab,
      },
    ],
  },
  {
    title: "Score",
    description: "Simple Osmd score",
    inputs: [
      {
        theater: "A",
        dqm: score,
      },
    ],
  },
];
