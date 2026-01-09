import type { IDqmPluginExamples } from "@dqm/package-dqm-api-v2";
import empty from "./empty.dqm?raw";

export const examples: IDqmPluginExamples = [
  {
    title: "Empty chord",
    description: "Simplest vexchords frame",
    inputs: [
      {
        theater: "A",
        dqm: empty,
      },
    ],
  },
];
