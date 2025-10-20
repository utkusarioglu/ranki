import type * as ohm from "ohm-js";
import type { RankiLangAstContext } from "@ranki/package-api-v2";
import type { ParseNodeFrameV2, ParseNodeFrameV2Fp } from "../types/node.mjs";
import type {
  NodeArgsFrameV2ConfigE,
  NodeArgsFrameV2Config,
  NodeArgsFrameV2ConfigP,
} from "../types/args.mjs";
import type { FrameSpec } from "../types/args.mjs";
import type { RankiLangParserPluginParseHandlerFrameV2 } from "../types/context.mjs";

export const nodeFrameV2: ohm.ActionDict<ParseNodeFrameV2> = {
  v2_fp(v2Start, v2FrameConfig, v2Payload, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const frameConfig: NodeArgsFrameV2Config =
      v2FrameConfig.v2FrameConfig(context);

    const child = v2Payload.node({
      ...context,
      plugin: frameConfig,
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
        separators: [],
        spaces: {},
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {
        frameConfig,
      },
      children: [child],
    } as ParseNodeFrameV2Fp;
  },

  v2_f(v2Start, v2FrameConfig, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const frameConfig: NodeArgsFrameV2ConfigP =
      v2FrameConfig.v2FrameConfig(context);

    const newContext: RankiLangAstContext<RankiLangParserPluginParseHandlerFrameV2> =
      {
        ...context,
        plugin: frameConfig,
      };
    const parseAst = context.hooks.createAstParser(newContext);

    const child = parseAst("");

    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        separators: [],
        spaces: {},
        // report: child.report,
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {
        frameConfig,
      },
      children: [child.root],
    };
  },

  v2_e(v2Start, wi1, v2Chain, wi2, v2End) {
    const context: RankiLangAstContext = { ...this.args.context };
    context.blockDepth++;
    const chain: FrameSpec[] = v2Chain.frameSpecV2(context);

    const frameConfig: NodeArgsFrameV2ConfigE = {
      type: "RankiFrameV2",
      version: "v2",
      variant: "e",
      chain,
      args: {
        depth: {
          block: context.blockDepth + 1,
          inline: context.inlineDepth,
          total: context.blockDepth + context.inlineDepth + 1,
        },
        spaces: {
          startAndChain: {
            type: "wi",
            raw: wi1.sourceString,
          },
          chainAndEnd: {
            type: "wi",
            raw: wi2.sourceString,
          },
        },
        separators: [],
      },
      params: {
        variant: "none",
        items: [],
      },
      subtree: {},
    };

    const newContext: RankiLangAstContext<RankiLangParserPluginParseHandlerFrameV2> =
      {
        ...context,
        plugin: frameConfig,
      };

    const parseAst = context.hooks.createAstParser(newContext);

    const child = parseAst("");

    return {
      kind: "parent",
      type: this.ctorName,
      args: {
        depth: {
          block: context.blockDepth,
          inline: context.inlineDepth,
          total: context.inlineDepth + context.blockDepth,
        },
        separators: [],
        spaces: {},
      },
      source: {
        type: "raw",
        raw: this.sourceString,
      },
      subtree: {
        frameConfig,
      },
      children: [child.root],
    };
  },
};
