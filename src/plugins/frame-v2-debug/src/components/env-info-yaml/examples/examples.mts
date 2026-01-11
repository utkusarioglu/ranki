import type { IDqmPluginExamples } from "@dqm/package-dqm-api-v2";

export const examples: IDqmPluginExamples = [
  {
    title: "Environment Info Yaml",
    description:
      "Displays detailed yaml information about the environment where Dqm is running",
    inputs: [
      {
        theater: "A",
        dqm: "[frame.v2.debug.environment_info.yaml]",
      },
    ],
  },
];
