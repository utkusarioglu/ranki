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
    const frameConfigContext = c(this);

    const frameConfig: NodeArgsFrameV2Config =
      v2FrameConfig.v2FrameConfig(frameConfigContext);

    const parentContext = frameConfigContext
      .newChild(this, "block")
      .newTransformerBoundary({
        handler: frameConfig.type,
        chain: frameConfig.chain.join("."),
        params: frameConfig.params.items,
      });

    const childContext = parentContext
      .newChild(this, "block")
      .newParserBoundary({
        type: frameConfig.type,
        chain: frameConfig.chain,
        params: frameConfig.params.items,
      });
    const child = v2Payload.node(childContext);
    // .parseAst(v2Payload.sourceString);

    return parentContext.newAstNode<
      ParseNodeFrameV2FpReduced,
      ParseNodeFrameV2
    >(
      {
        kind: "parent",
        shape: {
          separators: [],
          spaces: {},
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
    const context = c(this).newChild(this, "block");
    const frameConfig: NodeArgsFrameV2ConfigP =
      v2FrameConfig.v2FrameConfig(context);
    context.newTransformerBoundary({
      handler: frameConfig.type,
      chain: frameConfig.chain.join("."),
      params: frameConfig.params.items,
    });

    const child = context
      .newChild(this)
      .newParserBoundary({
        type: frameConfig.type,
        chain: frameConfig.chain,
        params: frameConfig.params.items,
      })
      .parseAst("");

    return context.newAstNode<ParseNodeFrameV2FReduced, ParseNodeFrameV2>(
      {
        kind: "parent",
        shape: {
          separators: [],
          spaces: {},
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
    const context = c(this).newChild(this, "block");
    const chain: FrameSpec[] = v2Chain.frameSpecV2(context);
    const configContext = context.newChild(this);

    // TODO, this shouldn't be here. it needs to be in frameConfig in the ohm grammar itself
    const frameConfig: NodeArgsFrameV2ConfigE = configContext.newAstNode<
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

    const child = context
      .newChild(this)
      .newParserBoundary({
        type: frameConfig.type,
        chain: frameConfig.chain,
        params: frameConfig.params.items,
      })
      .parseAst("");

    return context.newAstNode<ParseNodeFrameV2EReduced, ParseNodeFrameV2>(
      {
        kind: "parent",
        shape: {
          separators: [],
          spaces: {},
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
