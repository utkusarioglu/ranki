import { creatorName } from "./creatorName.mjs";
import { nodeBaseV2 } from "./nodeBaseV2.mjs";
import { nodeFrameV2 } from "./nodeFrameV2.mjs";
import { v2FrameConfig } from "./v2FrameConfig.mjs";
import { frameSpecV2 } from "./frameSpec.mjs";

export const actions = {
  node: {
    ...nodeFrameV2,
    ...nodeBaseV2,
  },
  v2FrameConfig,
  frameSpecV2,
  creatorName,
};
