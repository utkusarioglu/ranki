import type { RankiLangAstContext } from "@ranki/package-api-v2";
import type * as ohm from "ohm-js";
import type { NodeArgsFrameV2, FrameSpec } from "../types/args.mjs";
import { ArgsAndParamsV2 } from "@ranki/plugin-grammar-params-v2";

export const v2FrameConfig: ohm.ActionDict<NodeArgsFrameV2> = {
  v2FrameConfigP(wi1, v2Type, wi2, sep) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;

    const chain: FrameSpec[] = v2Type.frameSpecV2(context);
    return {
      type: "RankiFrameV2",
      version: "v2",
      variant: "p",
      chain,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        separators: [
          {
            type: sep.creatorName(context),
            raw: sep.sourceString,
          },
        ],
        spaces: {
          startAndType: {
            type: "wi",
            raw: wi1.sourceString,
          },
          typeAndSep: {
            type: "wi",

            raw: wi2.sourceString,
          },
        },
      },
      params: {
        variant: "none",
        items: [],
      },
      subtree: {},
    };
  },

  v2FrameConfigFp_f(
    wi1,
    v2Type,
    wi2,
    v2ParamListInlineContainer,
    wi3,
    sepRight,
  ) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const config: ArgsAndParamsV2 =
      v2ParamListInlineContainer.argsAndParamsV2(context);

    const chain: FrameSpec[] = v2Type.frameSpecV2(context);
    return {
      type: "RankiFrameV2",
      version: "v2",
      chain,
      variant: "fp_f",
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {
          start: {
            type: "wi",
            raw: wi1.sourceString,
          },
          typeAndParams: {
            type: "wi",
            raw: wi2.sourceString,
          },
          paramsAndSep: {
            type: "wi",
            raw: wi3.sourceString,
          },
        },
        separators: [
          {
            type: sepRight.creatorName(context),
            raw: sepRight.sourceString,
          },
        ],
      },
      params: config.params,
      subtree: {
        paramsContainer: {
          args: config.args,
        },
      },
    };
  },

  v2FrameConfigFp_F(
    wi1,
    v2Type,
    wi2,
    v2ParamListBlockContainer,
    wi3,
    sepRight,
  ) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const config: ArgsAndParamsV2 =
      v2ParamListBlockContainer.argsAndParamsV2(context);
    const chain: FrameSpec[] = v2Type.frameSpecV2(context);

    return {
      type: "RankiFrameV2",
      version: "v2",
      variant: "fp_F",
      chain,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        spaces: {
          start: {
            type: "wi",
            raw: wi1.sourceString,
          },
          typeAndParams: {
            type: "wi",
            raw: wi2.sourceString,
          },
          paramsAndSep: {
            type: "wi",
            raw: wi3.sourceString,
          },
        },
        separators: [
          {
            type: sepRight.creatorName(context),
            raw: sepRight.sourceString,
          },
        ],
      },
      params: config.params,
      subtree: {
        paramsContainer: {
          args: config.args,
        },
      },
    };
  },
};
