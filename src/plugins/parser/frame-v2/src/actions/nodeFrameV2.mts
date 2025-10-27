import type * as ohm from "ohm-js";
import { getContext as c } from "@ranki/package-api-v2/helpers";
import type {
  ParseNodeFrameV2,
  ParseNodeFrameV2EReduced,
  ParseNodeFrameV2FpReduced,
  ParseNodeFrameV2FReduced,
} from "../types/node.mjs";
import type {
  NodeArgsFrameV2ConfigE,
  NodeArgsFrameV2Config,
  NodeArgsFrameV2ConfigP,
} from "../types/args.mjs";
import type { FrameSpec } from "../types/args.mjs";
import type { RankiLangParserPluginParseHandlerFrameV2 as V2 } from "../types/context.mjs";

export const nodeFrameV2: ohm.ActionDict<ParseNodeFrameV2> = {
  v2_fp(v2Start, v2FrameConfig, v2Payload, v2End) {
    const context = c<V2>(this).newChild("block");
    const frameConfig: NodeArgsFrameV2Config =
      v2FrameConfig.v2FrameConfig(context);

    const payloadContext = context.newChild().setParser(frameConfig);

    const child = v2Payload.node(payloadContext);

    return context.enrich<ParseNodeFrameV2FpReduced, ParseNodeFrameV2>(
      {
        kind: "parent",
        creator: this.ctorName,
        shape: {
          separators: [],
          spaces: {},
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {
          frameConfig,
        },
        children: [child],
      },
    );
  },

  v2_f(v2Start, v2FrameConfig, v2End) {
    const context = c<V2>(this).newChild("block");
    const frameConfig: NodeArgsFrameV2ConfigP =
      v2FrameConfig.v2FrameConfig(context);

    const newContext = context.newChild().setParser(frameConfig);

    const child = context.parseAst("", newContext);

    return context.enrich<ParseNodeFrameV2FReduced, ParseNodeFrameV2>(
      {
        kind: "parent",
        creator: this.ctorName,
        shape: {
          separators: [],
          spaces: {},
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {
          frameConfig,
        },
        children: [child.root],
      },
    );
  },

  v2_e(v2Start, wi1, v2Chain, wi2, v2End) {
    const context = c<V2>(this).newChild("block");
    const chain: FrameSpec[] = v2Chain.frameSpecV2(context);

    // @ts-expect-error needs its parent
    const frameConfig: NodeArgsFrameV2ConfigE = {
      type: "RankiFrameV2",
      version: "v2",
      variant: "e",
      chain,
      shape: {
        ...context.getContextArgs(),
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

    const newContext = context.newChild().setParser(frameConfig);
    const child = context.parseAst("", newContext);

    return context.enrich<ParseNodeFrameV2EReduced, ParseNodeFrameV2>(
      {
        kind: "parent",
        creator: this.ctorName,
        shape: {
          separators: [],
          spaces: {},
        },
        source: {
          type: "raw",
          raw: this.sourceString,
        },
      },
      {
        subtree: {
          frameConfig,
        },
        children: [child.root],
      },
    );
  },
};
