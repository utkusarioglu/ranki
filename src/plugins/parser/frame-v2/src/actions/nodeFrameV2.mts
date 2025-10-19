import type * as ohm from "ohm-js";
import type { RankiLangAstContext } from "@ranki/package-api-v2";
import type { NodeArgsFrameV2ConfigFp_F, ParseNodeFrameV2 } from "../types.mjs";
import type { FrameSpec } from "../types.mjs";

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
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: [child],
    };
  },

  v2_f(v2Start, v2FrameConfig, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    // !FIX i'm not sure if this specific of a type is a good idea here
    const frameConfig: NodeArgsFrameV2ConfigFp_F =
      v2FrameConfig.v2FrameConfig(context);

    const child = context.hooks.parseAst("", {
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
        report: child.report,
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: [],
      children: [child.root],
    };
  },

  // @ts-expect-error FIX type in this doesn't seem to work
  // likely due to a design error
  v2_e(v2Start, wi1, v2Chain, wi2, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const chain: FrameSpec[] = v2Chain.frameSpecV2(context);
    const child = context.hooks.parseAst("", {
      ...context,
      plugin: {
        // !FIX
        // @ts-expect-error
        chain,
        version: "v2",
        variant: "e", // this is like f fp
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
        frame: {
          version: "v2",
          variant: "e",
          chain,
          args: {
            "wi.1.length": wi1.sourceString.length,
            "wi.2.length": wi2.sourceString.length,
          },
          report: child.report,
        },
      },
      children: [child.root],
    };
  },
};
