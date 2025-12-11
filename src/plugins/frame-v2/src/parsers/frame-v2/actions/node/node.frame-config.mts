import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { grabAst } from "@dqm/package-utils";

export const nodeFrameConfig: IAstNodeActionDict = {
  frameV2FrameConfigE(
    sBaseV2WasteInline1,
    frameV2ChainList,
    sBaseV2WasteInline2,
  ) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["space", sBaseV2WasteInline1])
      .pushNodes(["node", frameV2ChainList])
      .pushNodes(["space", sBaseV2WasteInline2]);
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

  frameV2FrameConfigFp_F(
    sBaseV2WasteInline,
    frameV2ChainList,
    sBaseV2WasteInline1,
    paramsV2ParamListBlockContainer,
    sBaseV2WasteInline2,
    tFrameV2SeparatorParam,
  ) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["space", sBaseV2WasteInline])
      .pushNodes(["node", frameV2ChainList])
      .pushNodes(["space", sBaseV2WasteInline1])
      .pushNodes(["node", paramsV2ParamListBlockContainer])
      .pushNodes(["space", sBaseV2WasteInline2])
      .pushNodes(["token", tFrameV2SeparatorParam]);
  },

  frameV2FrameConfigP(
    sBaseV2WasteInline1,
    frameV2ChainList,
    sBaseV2WasteInline2,
    tFrameV2SeparatorParam_nl,
  ) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["space", sBaseV2WasteInline1])
      .pushNodes(["node", frameV2ChainList])
      .pushNodes(["space", sBaseV2WasteInline2])
      .pushNodes(["token", tFrameV2SeparatorParam_nl]);
  },

  frameV2ChainList(paramsV2Key1, sBaseV2Clearance, paramsV2Key2) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", paramsV2Key1])
      .pushNodes(["space", sBaseV2Clearance], ["node", paramsV2Key2]);
  },
};
