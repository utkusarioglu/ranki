import type { IDqmComponentTransformFunction } from "@dqm/package-dqm-api-v2";

type TF = IDqmComponentTransformFunction;

// // const PARENT = ["debug", "block", "container"];
// const LEAF = ["debug", "leaf", "container"];

// const frameV2_fp: IDqmComponentTransformer = (trn) => {
//   trn.setChain(LEAF);

//   const payload = trn.getAst().getSubtreeNodes();
//   // const pauseList = payload.getSubtreeNodes();
//   // const section = pauseList.getSubtreeNodes();

//   trn.setSource(payload.map((v) => v.getCreator()).join("----"));
// };

const FRAME_V2_PAYLOAD_PLAIN: TF = () => {};

export const transformers = {
  FRAME_V2_PAYLOAD_PLAIN,
};
