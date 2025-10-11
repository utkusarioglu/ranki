import type { RankiLangAstContext } from "@ranki/package-api-v2";
import type * as ohm from "ohm-js";
import type {
  NodeArgsFrameV2,
  ArgsAndParamsV2FrameV2,
  FrameSpec,
} from "../types.mjs";

export const v2FrameConfig: ohm.ActionDict<NodeArgsFrameV2> = {
  // v2DirectiveConfig_D(wi1, nl, wi2, v2ParamListBlock, whitespace) {
  //   const context: RankiLangAstContext = { ...this.args.context };
  //   context.blockDepth++;
  //   const params = v2ParamListBlock.paramsV2(context);
  //   return {
  //     "directive.v2": {
  //       type: this.ctorName,
  //       args: {
  //         depth: {
  //           block: context.blockDepth,
  //           inline: context.inlineDepth,
  //           total: context.inlineDepth + context.blockDepth,
  //         },
  //         "wi.1.length": wi1.sourceString.length,
  //         "wi.2.length": wi2.sourceString.length,
  //       },
  //       params: {
  //         variant: "block",
  //         items: params,
  //       },
  //     },
  //   };
  // },
  // v2DirectiveConfig_d(wi1, v2ParamListInline, wi2) {
  //   const context: RankiLangAstContext = { ...this.args.context };
  //   context.blockDepth++;
  //   const params = v2ParamListInline.paramsV2(context);
  //   return {
  //     "directive.v2": {
  //       type: this.ctorName,
  //       args: {
  //         depth: {
  //           block: context.blockDepth,
  //           inline: context.inlineDepth,
  //           total: context.inlineDepth + context.blockDepth,
  //         },
  //         "wi.1.length": wi1.sourceString.length,
  //         "wi.2.length": wi2.sourceString.length,
  //       },
  //       params: {
  //         variant: "inline",
  //         items: params,
  //       },
  //     },
  //   };
  // },
  v2FrameConfigP(wi1, v2Type, wi2, sep) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;

    const chain: FrameSpec[] = v2Type.frameSpecV2(context);
    return {
      frame: {
        version: "v2",
        // type: this.ctorName,
        // frameType: v2Type.sourceString,
        chain,
        variant: "p",
        args: {
          depth: {
            block: context.blockDepth,
            inline: context.inlineDepth,
            total: context.inlineDepth + context.blockDepth,
          },
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
          "separator.right.type": sep.creatorName(context),
        },
      },
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
    const config: ArgsAndParamsV2FrameV2 =
      v2ParamListInlineContainer.argsAndParamsV2(context);

    const chain: FrameSpec[] = v2Type.frameSpecV2(context);
    return {
      frame: {
        version: "v2",
        // type: this.ctorName,
        // frameType: v2Type.sourceString,
        chain,
        variant: "fp_f",
        args: {
          depth: {
            block: context.blockDepth,
            inline: context.inlineDepth,
            total: context.inlineDepth + context.blockDepth,
          },
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
          "wi.3.length": wi3.sourceString.length,

          // !FIX this expects iter if `creatorName` is called
          // "separator.right.type": sepRight.creatorName(context),
          "separator.right.type": sepRight.sourceString,

          "frame.v2.config": config.args,
        },
        params: config.params,
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
    const config: ArgsAndParamsV2FrameV2 =
      v2ParamListBlockContainer.argsAndParamsV2(context);
    const chain: FrameSpec[] = v2Type.frameSpecV2(context);

    return {
      frame: {
        version: "v2",
        variant: "fp_F",
        chain,
        args: {
          depth: {
            block: context.blockDepth,
            inline: context.inlineDepth,
            total: context.inlineDepth + context.blockDepth,
          },
          "wi.1.length": wi1.sourceString.length,
          "wi.2.length": wi2.sourceString.length,
          "wi.3.length": wi3.sourceString.length,
          // !FIX sepRight doesn't work
          // "separator.right.type": sepRight.creatorName(context),
          "separator.right.type": sepRight.sourceString,
          "frame.v2.config": config.args,
        },
        params: config.params,
      },
    };
  },
};
