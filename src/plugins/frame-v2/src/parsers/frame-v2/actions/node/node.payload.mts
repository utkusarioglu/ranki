import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { grabAssertExists, grabAst } from "@dqm/package-plugin-utils";

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
    return grabAst(this)
      .newAst(this)
      .setTransformClass("FRAME_V2_PAYLOAD_PLAIN")
      .pushIgnoredNodes(all)
      .parse(all.sourceString);
    // return node;
  },

  frameV2PauseDepth(all) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(all)
      .setLeafViewDecoder("number", (v) => ({
        value: +v,
      }));
  },

  frameV2PauseStart(tFrameV2Pause1, frameV2PauseDepth, tFrameV2Pause2) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(tFrameV2Pause1)
      .pushNodes(["node", frameV2PauseDepth])
      .pushIgnoredNodes(tFrameV2Pause2);
  },

  frameV2PausedContainer_p(
    frameV2PauseStart,
    frameV2PausedPayload,
    frameV2PauseEnd,
  ) {
    const node = grabAst(this)
      .newAst(this)
      // .setTransformClass("FRAME_V2_PAUSED")
      .pushNodes(["node", frameV2PauseStart])
      .pushNodes(["node", frameV2PausedPayload])
      .pushIgnoredNodes(frameV2PauseEnd);

    const [start] = node.getSubtreeNodes();
    grabAssertExists(this, start, "Start is required for depth detection");
    const [depth] = start.getSubtreeNodes();
    const climb = depth ? depth.getLeafView().value : null;
    node.setCpsClimb(climb).parse(frameV2PausedPayload.sourceString);

    return node;
  },

  frameV2PausedPayload(all) {
    return (
      grabAst(this)
        .newAst(this)
        .setTransformClass("FRAME_V2_PAUSED")
        // .pushNodes(["node", frameV2PauseStart])
        // .pushNodes(["node", frameV2PausedPayload])
        .pushIgnoredNodes(all)
    );
  },

  // frameV2PausedPayload(any) {
  //   return grabAst(this)
  //     .newAst(this)
  //     .pushIgnoredNodes(any)
  //     .parse(this.sourceString);
  // },
};
