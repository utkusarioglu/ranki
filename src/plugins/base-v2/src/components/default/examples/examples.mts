import type { IDqmPluginExamples } from "@dqm/package-dqm-api-v2";
import helloWorld from "./hello-world.dqm?raw";

export const examples: IDqmPluginExamples = [
  {
    title: "Hello World",
    description: "Two word rendering",
    inputs: [
      {
        theater: "A",
        dqm: helloWorld,
      },
    ],
  },
];
