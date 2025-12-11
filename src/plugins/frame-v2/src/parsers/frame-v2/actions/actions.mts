import { nodeFrameConfig } from "./node/node.frame-config.mjs";
import { nodeFrame } from "./node/node.frame.mjs";
import { nodePayload } from "./node/node.payload.mjs";
import { token } from "./token/token.mjs";

export const actions = {
  node: {
    ...nodeFrame,
    ...nodePayload,
    ...nodeFrameConfig,
  },
  token,
};
