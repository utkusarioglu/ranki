import type * as ohm from "ohm-js";
import type { RankiLangAstContext } from "@ranki/package-api-v2";

export const creatorName: ohm.ActionDict<string> = {
  tFrameV2SeparatorParam(sep) {
    const context: RankiLangAstContext = this.args.context;
    const merged = context.hooks.getConfig().merged;
    const separators =
      // @ts-expect-error
      merged.plugins.config.RankiParamsV2.tokens.separator;
    return sep.sourceString === separators.frame ? this.ctorName : "none";
  },
};
