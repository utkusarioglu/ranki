import type { IDqmPluginExamples } from "@dqm/package-dqm-api-v2";

export const examples: IDqmPluginExamples = [
  {
    title: "Empty debug block",
    description: "Most basic debug component",
    inputs: [
      {
        theater: "A",
        dqm: "[debug]",
      },
    ],
  },
];
