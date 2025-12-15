import { node } from "./node.mjs";
import { nodeValueItem } from "./node.value-item.mjs";
import { token } from "./token.mjs";

export const actions = {
  node: {
    ...node,
    ...nodeValueItem,
  },
  token,
};
