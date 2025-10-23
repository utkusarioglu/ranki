import type * as ohm from "ohm-js";
import type { RankiLangContextInstance as R } from "@ranki/package-api-v2";
import type { RankiFrameV2ParserPluginConfig } from "../types/config.mjs";

export const creatorName: ohm.ActionDict<string> = {
  tFrameV2SeparatorParam(sep) {
    const context = this.args.context as R;
    const config =
      context.getPluginConfig<RankiFrameV2ParserPluginConfig>("RankiFrameV2");
    const separator = config.tokens.separator;

    return sep.sourceString === separator.param ? this.ctorName : "none";
  },
};
