import type {
  ChainList,
  IAstNodeActionDict,
  IParam,
} from "@dqm/package-dqm-api-v2";
import { grabAst } from "@dqm/package-utils";

const COMPONENT: ChainList = [["frame", "v2", "container"]];
const PARAMS: IParam[] = [];

export const node: IAstNodeActionDict = {
  baseV2Block_frameV2(sBaseV2Indentation, frameV2, sBaseV2WasteInline, nlEnd) {
    return grabAst(this)
      .newAst(this)
      .newCpx((cpx) => cpx.setParams(PARAMS).setIdList(COMPONENT))
      .pushNodes(["space", sBaseV2Indentation])
      .pushNodes(["child", frameV2])
      .pushNodes(["space", sBaseV2WasteInline])
      .pushNodes(["token", nlEnd]);
  },

  frameV2_fp(frameV2Start, frameV2FrameConfig, frameV2Payload, frameV2End) {
    return (
      grabAst(this)
        .newAst(this)
        .newCpx((cpx) =>
          cpx.setParams(PARAMS).setIdList([["frame", "v2", "code"]]),
        )
        .pushIgnoredNodes(frameV2Start)
        .pushIgnoredNodes(frameV2FrameConfig)
        // TODO
        // .pushNodes(["subtree", frameV2FrameConfig])
        .pushNodes(["subtree", frameV2Payload])
        .pushIgnoredNodes(frameV2End)
    );
  },

  frameV2Payload_P(sBaseV2WasteInline, frameV2PauseList) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["space", sBaseV2WasteInline])
      .pushNodes(["subtree", frameV2PauseList]);
  },

  frameV2PauseList(
    frameV2PayloadSection,
    frameV2PausedContainer,
    frameV2PayloadSection2,
  ) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["subtree", frameV2PayloadSection])
      .pushNodes(
        ["subtree", frameV2PausedContainer],
        ["subtree", frameV2PayloadSection2],
      );
  },

  frameV2PayloadSection(frameV2PayloadSectionItem) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["subtree", frameV2PayloadSectionItem]);
  },

  frameV2PayloadSectionItem(frameV2OrFrameV2PayloadPlain, sBaseV2Whitespace) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["child", frameV2OrFrameV2PayloadPlain])
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
      .pushNodes(["subtree", frameV2PausedPayload])
      .pushIgnoredNodes(frameV2PauseEnd);
  },

  frameV2PausedPayload(any) {
    return grabAst(this).newAst(this).pushIgnoredNodes(any);
  },
};
