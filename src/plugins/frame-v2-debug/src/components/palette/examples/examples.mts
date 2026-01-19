import type { IDqmPluginExamples } from "@dqm/package-dqm-api-v2";

export const examples: IDqmPluginExamples = [
  {
    title: "Environment Info Yaml",
    description:
      "Displays detailed information about the environment where Dqm is running as a QR code",
    inputs: [
      {
        theater: "A",
        dqm: "[frame.v2.debug.environment_info.qr]",
      },
    ],
  },
];
