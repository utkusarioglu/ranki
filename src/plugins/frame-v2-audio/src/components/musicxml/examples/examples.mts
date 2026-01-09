import type { IDqmPluginExamples } from "@dqm/package-dqm-api-v2";
import music21 from "./music21.dqm?raw";
import musescore from "./musescore.dqm?raw";

export const examples: IDqmPluginExamples = [
  {
    title: "Music21",
    description: "Music21 Output",
    inputs: [
      {
        theater: "A",
        dqm: music21,
      },
    ],
  },
  {
    title: "Musescore",
    description: "Musescore Output",
    inputs: [
      {
        theater: "A",
        dqm: musescore,
      },
    ],
  },
];
