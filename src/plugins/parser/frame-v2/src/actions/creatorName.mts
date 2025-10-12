import type * as ohm from "ohm-js";
import type { RankiLangAstContext } from "@ranki/package-api-v2";

export const creatorName: ohm.ActionDict<string> = {
  tFrameV2SeparatorParam(sep) {
    const context: RankiLangAstContext = this.args.context;
    const separators =
      // @ts-expect-error
      context.lang.getConfig().merged.plugins.config.RankiParamsV2.tokens
        .separator;
    return sep.sourceString === separators.frame ? this.ctorName : "none";
  },

  // v2Payload_P(wi1, nl1, pauseList) {
  //   return "P";
  // },

  // v2Payload_p(pauseList) {
  //   return "p";
  // },
};
