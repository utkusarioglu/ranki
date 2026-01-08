import type { IDqmPluginExamples } from "@dqm/package-dqm-api-v2";
import helloWorld from "./hello-world.dqm?raw";
import ignoredOneLiner from "./ignored-one-liner.dqm?raw";

export const examples: IDqmPluginExamples = [
  {
    title: "Ignored One liner",
    description: "BaseV2 ignoring everything after the ignore token",
    inputs: [
      {
        theater: "A",
        dqm: ignoredOneLiner,
      },
    ],
  },
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
  {
    title: "Integer",
    description: "Basic integer parsing",
    inputs: [
      {
        theater: "A",
        dqm: "1 234",
      },
    ],
  },
];
