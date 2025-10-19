import type * as ohm from "ohm-js";
import { FrameSpec } from "../types/args.mjs";

export const frameSpecV2: ohm.ActionDict<FrameSpec[]> = {
  v2Chain(first, sep, rest) {
    return [
      first.paramV2Key(this.args.context),
      ...rest.paramV2Key(this.args.context),
    ];
  },
};
