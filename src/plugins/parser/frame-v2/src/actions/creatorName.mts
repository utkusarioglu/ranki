import type * as ohm from "ohm-js";
import { getContext as c } from "@ranki/package-api-v2/helpers";
import type { RankiFrameV2ParserPluginConfig } from "../types/config.mjs";

export const creatorName: ohm.ActionDict<string> = {
  tFrameV2SeparatorParam(sep) {
    const context = c(this);
    const config =
      context.getPluginConfig<RankiFrameV2ParserPluginConfig>("RankiFrameV2");
    const separator = config.tokens.separator;

    return sep.sourceString === separator.param ? this.ctorName : "none";
  },
};
