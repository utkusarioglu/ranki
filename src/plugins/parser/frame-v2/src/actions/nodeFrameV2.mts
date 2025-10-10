import type {
  RankiLangAstContext,
  RankiLanguageProvidedConfig,
} from "@ranki/package-api";
import type * as ohm from "ohm-js";
import type {
  NodeArgsFrameV2Config,
  NodeArgsFrameV2ConfigFp_F,
  NodeArgsFrameV2E,
  ParseNodeFrameV2,
} from "../types.mjs";
import type {
  // NodeArgsFrameV2,
  // ArgsAndParamsV2FrameV2,
  FrameSpec,
} from "../types.mjs";
// !FIX should come from exports

export const nodeFrameV2: ohm.ActionDict<ParseNodeFrameV2> = {
  v2_fp(directive, frame, v2FrameConfig, v2Payload, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const frameConfig: NodeArgsFrameV2ConfigFp_F =
      v2FrameConfig.v2FrameConfig(context);

    const child = context.lang.parse(
      { [context.theater]: v2Payload.sourceString },
      {
        ...context,
        frame: frameConfig["frame"],
      },
    );

    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        ...frameConfig,

        report: child.report,
        raw: child.theaters[context.theater].stages.raw,
      },
      children: [child.theaters[context.theater].stages.ast.root],
    };
  },

  // @ts-expect-error FIX type in this doesn't seem to work
  // likely due to a design error
  v2_e(directive, frame, wi1, v2Chain, wi2, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const chain: FrameSpec[] = v2Chain.frameSpecV2(context);
    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        frame: {
          version: "v2",
          variant: "e",
          chain,
          args: {
            "wi.1.length": wi1.sourceString.length,
            "wi.2.length": wi2.sourceString.length,
          },
          // params: [],
        },
        // ...v2FrameConfig.v2FrameConfig(context),
      },
      children: [],
    };
  },
};
