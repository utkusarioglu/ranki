import type * as ohm from "ohm-js";
import type { RankiLangAstContext } from "@ranki/package-api-v2";
import type { WithRankiFrameV2PluginConfig } from "../types/config.mjs";

export const creatorName: ohm.ActionDict<string> = {
  tFrameV2SeparatorParam(sep) {
    const context: RankiLangAstContext = this.args.context;
    const merged = context.hooks.getConfig().merged.plugins
      .config as WithRankiFrameV2PluginConfig;
    const separator = merged.RankiFrameV2.tokens.separator;

    return sep.sourceString === separator.param ? this.ctorName : "none";
  },
};
