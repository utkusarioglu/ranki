import type * as ohm from "ohm-js";
import type { RankiLangAstContext } from "@ranki/package-api-v2";
import type { NodeArgsFrameV2ConfigFp_F, ParseNodeFrameV2 } from "../types.mjs";
import type { FrameSpec } from "../types.mjs";
import type { RankiLangParserPluginParseHandlerFrameV2 } from "../types.mjs";

export const nodeFrameV2: ohm.ActionDict<ParseNodeFrameV2> = {
  v2_fp(v2Start, v2FrameConfig, v2Payload, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    // !FIX i'm not sure if this specific of a type is a good idea here
    const frameConfig: NodeArgsFrameV2ConfigFp_F =
      v2FrameConfig.v2FrameConfig(context);

    const child = v2Payload.node({
      ...context,
      plugin: {
        ...frameConfig["frame"],
        type: "RankiFrameV2",
      },
    });

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
      },
      children: [child],
    };
  },

  v2_f(v2Start, v2FrameConfig, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    // !FIX i'm not sure if this specific of a type is a good idea here
    const frameConfig: NodeArgsFrameV2ConfigFp_F =
      v2FrameConfig.v2FrameConfig(context);

    const child = context.lang.parse<RankiLangParserPluginParseHandlerFrameV2>(
      { [context.theater]: "" },
      {
        ...this.args.context,
        plugin: {
          ...frameConfig["frame"],
          type: "RankiFrameV2",
        },
      },
      // this.args.context,
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
      },
      // children: [],

      children: [child.theaters[context.theater].stages.ast.root],
    };
  },

  // @ts-expect-error FIX type in this doesn't seem to work
  // likely due to a design error
  v2_e(v2Start, wi1, v2Chain, wi2, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const chain: FrameSpec[] = v2Chain.frameSpecV2(context);

    // args: Partial<NodeArgsBaseV2> & {
    //   "separator.right.type": string;
    //   // !FIX this value is inside the config structure, which breaks symmetry
    //   // "separator.left.type": string;
    //   "frame.v2.config": Partial<NodeArgsBaseV2>;
    // };
    // params: ParamsV2Spec;

    const child = context.lang.parse<RankiLangParserPluginParseHandlerFrameV2>(
      { [context.theater]: "" },
      {
        ...this.args.context,
        plugin: {
          // !FIX
          chain,
          version: "v2",
          variant: "e", // this is like f fp
          // ...frameConfig["frame"],
          type: "RankiFrameV2",
        },
      },
      // this.args.context,
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
      // children: [],

      children: [child.theaters[context.theater].stages.ast.root],
    };
  },
};
