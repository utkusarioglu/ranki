import type * as ohm from "ohm-js";
import { getContext as c } from "@ranki/package-api-v2/helpers";
import type { ComponentChainString } from "@ranki/package-api-v2";

export const frameSpecV2: ohm.ActionDict<ComponentChainString[]> = {
  v2ChainList(first, _sep, rest) {
    const context = c(this);
    const what = [first.paramV2Key(context), ...rest.paramV2Key(context)];
    return what;
  },
};
