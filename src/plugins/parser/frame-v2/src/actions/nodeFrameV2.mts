import type * as ohm from "ohm-js";
import { getContext as c } from "@ranki/package-api-v2/helpers";
import type {
  ParseNodeFrameV2,
  ParseNodeFrameV2FpReduced,
  ParseNodeFrameV2FReduced,
} from "../types/node.mjs";
import type {
  NodeArgsFrameV2Config,
  NodeArgsFrameV2ConfigP,
} from "../types/args.mjs";

export const nodeFrameV2: ohm.ActionDict<ParseNodeFrameV2> = {
  v2_fp(_v2Start, v2FrameConfig, v2Payload, _v2End) {
    const frameConfigContext = c(this);

    const frameConfig: NodeArgsFrameV2Config =
      v2FrameConfig.v2FrameConfig(frameConfigContext);

    const parentContext = frameConfigContext
      .newChild(this, "block")
      .newComponentBoundary({
        handler: frameConfig.type,
        // !fix I don't like this
        chain: frameConfig.chainList[0],
        params: frameConfig.params.items,
      });

    const childContext = parentContext
      .newChild(this, "block")
      .newParserBoundary({
        type: frameConfig.type,
        chainList: frameConfig.chainList,
        params: frameConfig.params.items,
      });
    const child = v2Payload.node(childContext);

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
    context.newComponentBoundary({
      handler: frameConfig.type,
      chain: frameConfig.chainList[0],
      params: frameConfig.params.items,
    });

    const child = context
      .newChild(this)
      .newParserBoundary({
        type: frameConfig.type,
        chainList: frameConfig.chainList,
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
};
