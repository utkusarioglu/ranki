import type * as ohm from "ohm-js";
import { FrameSpec } from "../types/args.mjs";
import { getContext as c } from "@ranki/package-api-v2/helpers";

export const frameSpecV2: ohm.ActionDict<FrameSpec[]> = {
  v2Chain(first, sep, rest) {
    const context = c(this);
    return [first.paramV2Key(context), ...rest.paramV2Key(context)];
  },
};
