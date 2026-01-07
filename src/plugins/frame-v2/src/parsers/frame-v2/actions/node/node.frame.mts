import type {
  // ChainList,
  IAstNode,
  IAstNodeActionDict,
  IAstParamNode,
} from "@dqm/package-dqm-api-v2";
import * as ohm from "ohm-js";
import { grabAssertNodeExists, grabAst } from "@dqm/package-plugin-utils";

// const COMPONENT: ChainList = [["frame", "v2", "container"]];
// const PARAMS: IAstParamNode[] = [];

export const nodeFrame: IAstNodeActionDict = {
  baseV2Block_frameV2(sBaseV2Indentation, frameV2, sBaseV2WasteInline, nlEnd) {
    return (
      grabAst(this)
        .newAst(this)
        // .newCpx((cpx) => cpx.setAstParams(PARAMS).setIdList(COMPONENT))
        .pushNodes(["space", sBaseV2Indentation])
        .pushNodes(["node", frameV2])
        .pushNodes(["space", sBaseV2WasteInline])
        .pushNodes(["token", nlEnd])
    );
  },

  frameV2_f(frameV2Start, frameV2FrameConfig, frameV2End) {
    const parent = grabAst(this)
      .newAst(this)
      .setTransformClass("FRAME_V2")
      .pushNodes(["node", frameV2FrameConfig]);

    parseFrame(this, parent)
      .pushNodes(["token", frameV2Start])
      .pushIgnoredNodes(frameV2FrameConfig)
      .pushNodes(["token", frameV2End]);

    return parent;
  },

  frameV2_fp(frameV2Start, frameV2FrameConfig, frameV2Payload, frameV2End) {
    const parent = grabAst(this)
      .newAst(this)
      .setTransformClass("FRAME_V2")
      .pushNodes(["node", frameV2FrameConfig]);

    parseFrame(this, parent)
      .pushNodes(["token", frameV2Start])
      .pushIgnoredNodes(frameV2FrameConfig)
      .pushNodes(["node", frameV2Payload])
      .pushNodes(["token", frameV2End]);

    return parent;
  },
};

/**
 * @dev
 * #1 Here we aren't using `find` method because there are many different
 * kinds of `frameV2FrameConfig` creators. Their common point is that they
 * are the first and only subtree node of their parent.
 */
function parseFrame(self: ohm.Node, parent: IAstNode) {
  // #1
  const frameV2FrameConfigFp = parent.getSubtreeNodes()[0];
  grabAssertNodeExists(self, frameV2FrameConfigFp, "frameV2FrameConfigFp");
  const keyNode =
    frameV2FrameConfigFp.findSubtreeNodeByCreator("frameV2ChainList");
  grabAssertNodeExists(self, keyNode, "frameV2ChainList");
  const idList = keyNode
    .getSubtreeNodes()
    .map((v) => v.getSubtreeNodes().map((v) => v.getSourceString()));

  let params: IAstParamNode[] = [];

  const paramListInlineContainer =
    frameV2FrameConfigFp.findSubtreeNodeByCreator(
      "paramsV2ParamListInlineContainer",
    );
  if (paramListInlineContainer) {
    const paramListInline = paramListInlineContainer.findSubtreeNodeByCreator(
      "paramsV2ParamListInline",
    );
    grabAssertNodeExists(self, paramListInline, "paramsV2ParamListInline");
    params = paramListInline.getSubtreeNodes() as IAstParamNode[];
  }

  return frameV2FrameConfigFp.newCpx((cpx) =>
    cpx.setAstParams(params).setIdList(idList),
  );
}
