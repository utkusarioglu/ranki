import type { IDqmPluginExamples } from "@dqm/package-dqm-api-v2";
import codeBlockWithParams from "./code-block-with-params.dqm?raw";
import nested from "./nested.dqm?raw";
import carnage from "./carnage.dqm?raw";
import pause from "./pause-test.dqm?raw";

export const examples: IDqmPluginExamples = [
  {
    title: "Inline code block",
    description: "Most basic inline code block",
    inputs: [
      {
        theater: "A",
        dqm: "[code|func]",
      },
    ],
  },
  {
    title: "Code block with params",
    description: "Uses params and pauses",
    inputs: [
      {
        theater: "A",
        dqm: codeBlockWithParams,
      },
    ],
  },
  {
    title: "Nested code block",
    description: "Code block which contains other code blocks",
    inputs: [
      {
        theater: "A",
        dqm: nested,
      },
    ],
  },
  {
    title: "Graph Carnage",
    description: "Many nested frames to create a graph carnage",
    inputs: [
      {
        theater: "A",
        dqm: carnage,
      },
    ],
  },
  {
    title: "Pause Test",
    description: "Paused code + anchor",
    inputs: [
      {
        theater: "A",
        dqm: pause,
      },
    ],
  },
];
