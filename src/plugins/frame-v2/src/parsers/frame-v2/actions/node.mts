import type {
  ChainList,
  IAstNodeActionDict,
  IParam,
} from "@dqm/package-dqm-api-v2";
import { assertExists, grabAst } from "@dqm/package-utils";

const COMPONENT: ChainList = [["frame", "v2", "container"]];
const PARAMS: IParam[] = [];

export const node: IAstNodeActionDict = {
  baseV2Block_frameV2(sBaseV2Indentation, frameV2, sBaseV2WasteInline, nlEnd) {
    return grabAst(this)
      .newAst(this)
      .newCpx((cpx) => cpx.setParams(PARAMS).setIdList(COMPONENT))
      .pushNodes(["space", sBaseV2Indentation])
      .pushNodes(["node", frameV2])
      .pushNodes(["space", sBaseV2WasteInline])
      .pushNodes(["token", nlEnd]);
  },

  frameV2_fp(frameV2Start, frameV2FrameConfig, frameV2Payload, frameV2End) {
    const parent = grabAst(this)
      .newAst(this)
      .pushNodes(["node", frameV2FrameConfig]);

    const frameV2FrameConfigFp_f = parent.findSubtreeNodeByCreator(
      "frameV2FrameConfigFp_f",
    );
    assertExists(frameV2FrameConfigFp_f, { method: "config" });
    const keyNode =
      frameV2FrameConfigFp_f.findSubtreeNodeByCreator("frameV2ChainList");
    assertExists(keyNode, { method: "key" });
    const idList = keyNode
      .getSubtreeNodes()
      .map((v) => v.getSubtreeNodes().map((v) => v.getSourceString()));

    const paramListInlineContainer =
      frameV2FrameConfigFp_f.findSubtreeNodeByCreator(
        "paramsV2ParamListInlineContainer",
      );

    assertExists(paramListInlineContainer, {
      method: "paramsV2ParamListInlineContainer",
    });

    const paramListInline = paramListInlineContainer.findSubtreeNodeByCreator(
      "paramsV2ParamListInline",
    );
    assertExists(paramListInline, {});
    const params = paramListInline.getSubtreeNodes() as IParam[];
    // // @ts-expect-error
    // const old = [["frame", "v2", "code"]];

    frameV2FrameConfigFp_f
      .newCpx((cpx) => cpx.setParams(params).setIdList(idList))
      .pushIgnoredNodes(frameV2Start)
      .pushIgnoredNodes(frameV2FrameConfig)
      .pushNodes(["node", frameV2Payload])
      .pushIgnoredNodes(frameV2End);

    return parent;
  },

  frameV2Payload_P(sBaseV2WasteInline, frameV2PauseList) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["space", sBaseV2WasteInline])
      .pushNodes(["node", frameV2PauseList]);
  },

  frameV2PauseList(
    frameV2PayloadSection,
    frameV2PausedContainer,
    frameV2PayloadSection2,
  ) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", frameV2PayloadSection])
      .pushNodes(
        ["node", frameV2PausedContainer],
        ["node", frameV2PayloadSection2],
      );
  },

  frameV2PayloadSection(frameV2PayloadSectionItem) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", frameV2PayloadSectionItem]);
  },

  frameV2PayloadSectionItem(frameV2OrFrameV2PayloadPlain, sBaseV2Whitespace) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", frameV2OrFrameV2PayloadPlain])
      .pushNodes(["space", sBaseV2Whitespace]);
  },

  frameV2PayloadPlain(all) {
    return grabAst(this).newAst(this).pushIgnoredNodes(all);
  },

  frameV2PausedContainer_p(
    frameV2PauseStart,
    frameV2PausedPayload,
    frameV2PauseEnd,
  ) {
    return grabAst(this)
      .newAst(this)
      .newCpx((cpx) =>
        // !FIX this mess relates to the .setParent() call in `newCpx()`
        // !FIX ALSO, don't forget that the parent of any kind of frame is frame.v2.container. so, this needs to climb twice, not once
        cpx.getParent().getParent().getParent(),
      )
      .pushIgnoredNodes(frameV2PauseStart)
      .pushNodes(["node", frameV2PausedPayload])
      .pushIgnoredNodes(frameV2PauseEnd);
  },

  frameV2PausedPayload(any) {
    return grabAst(this).newAst(this).pushIgnoredNodes(any);
  },

  frameV2FrameConfigFp_f(
    sBaseV2WasteInline,
    frameV2ChainList,
    sBaseV2WasteInline1,
    paramsV2ParamListInlineContainer,
    sBaseV2WasteInline2,
    tFrameV2SeparatorParam,
  ) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["space", sBaseV2WasteInline])
      .pushNodes(["node", frameV2ChainList])
      .pushNodes(["space", sBaseV2WasteInline1])
      .pushNodes(["node", paramsV2ParamListInlineContainer])
      .pushNodes(["space", sBaseV2WasteInline2])
      .pushNodes(["token", tFrameV2SeparatorParam]);
  },

  frameV2ChainList(paramsV2Key1, sBaseV2Clearance, paramsV2Key2) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", paramsV2Key1])
      .pushNodes(["space", sBaseV2Clearance], ["node", paramsV2Key2]);
  },
};
