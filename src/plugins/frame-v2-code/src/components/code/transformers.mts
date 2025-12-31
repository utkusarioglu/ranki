import type { IDqmComponentTransformer } from "@dqm/package-dqm-api-v2";

// const PARENT = ["debug", "block", "container"];
const LEAF = ["debug", "leaf", "container"];

const frameV2_fp: IDqmComponentTransformer = (trn) => {
  trn.setChain(LEAF);

  const payload = trn.getAst().getSubtreeNodes();
  // const pauseList = payload.getSubtreeNodes();
  // const section = pauseList.getSubtreeNodes();

  trn.setSource(payload.map((v) => v.getCreator()).join("----"));
};

export const transformers = {
  frameV2_fp,
};
