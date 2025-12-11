import type {
  // ChainList,
  // IAstNode,
  IAstNodeActionDict,
  // IParam,
} from "@dqm/package-dqm-api-v2";
import {
  // assertExists,
  grabAst,
} from "@dqm/package-utils";

// const COMPONENT: ChainList = [["frame", "v2", "container"]];
// const PARAMS: IParam[] = [];

export const nodePayload: IAstNodeActionDict = {
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
};
