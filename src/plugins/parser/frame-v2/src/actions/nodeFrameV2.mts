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
  NodeArgsFrameV2ConfigE_Reduced,
} from "../types/args.mjs";
import type { FrameSpec } from "../types/args.mjs";

export const nodeFrameV2: ohm.ActionDict<ParseNodeFrameV2> = {
  v2_fp(_v2Start, v2FrameConfig, v2Payload, _v2End) {
    const context = c(this).newChild("block");
    const frameConfig: NodeArgsFrameV2Config =
      v2FrameConfig.v2FrameConfig(context);

    const payloadContext = context.newChild().setParser({
      type: frameConfig.type,
      chain: frameConfig.chain,
      // @ts-expect-error complains about "key" type
      params: frameConfig.params.items,
    });

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

  v2_f(_v2Start, v2FrameConfig, _v2End) {
    const context = c(this).newChild("block");
    const frameConfig: NodeArgsFrameV2ConfigP =
      v2FrameConfig.v2FrameConfig(context);

    const newContext = context.newChild().setParser({
      type: frameConfig.type,
      chain: frameConfig.chain,
      params: frameConfig.params.items,
    });

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

  v2_e(_v2Start, wi1, v2Chain, wi2, _v2End) {
    const context = c(this).newChild("block");
    const chain: FrameSpec[] = v2Chain.frameSpecV2(context);
    const configContext = context.newChild();

    const frameConfig: NodeArgsFrameV2ConfigE = configContext.enrich<
      NodeArgsFrameV2ConfigE_Reduced,
      NodeArgsFrameV2ConfigE
    >(
      {
        type: "RankiFrameV2",
        version: "v2",
        variant: "e",
        chain,
        shape: {
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
      },
      {
        subtree: {},
      },
    );

    const newContext = context.newChild().setParser({
      type: frameConfig.type,
      chain: frameConfig.chain,
      params: frameConfig.params.items,
    });
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
