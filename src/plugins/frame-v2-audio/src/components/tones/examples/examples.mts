import type { IDqmPluginExamples } from "@dqm/package-dqm-api-v2";
import bach from "./bach.dqm?raw";

export const examples: IDqmPluginExamples = [
  {
    title: "Bach",
    description: "Let's listen to some Bach",
    inputs: [
      {
        theater: "A",
        dqm: bach,
      },
    ],
  },
];
