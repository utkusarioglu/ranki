// import type { IDqmComponentTransformer } from "@dqm/package-dqm-api-v2";

// const PARENT = ["debug", "block", "container"];

// const baseV2Block_frameV2: IDqmComponentTransformer = (trn) => {
//   trn.setChain(PARENT);
//   trn
//     .getAst()
//     .getChildren()
//     .filter((v) => "node" === v.getCreationMethod())
//     .forEach((s) => trn.newTrnNode(s));
//   // trn
//   //   .getAst()
//   //   .getSubtreeNodes()
//   //   .forEach((s) => trn.newTrnNode(s));
//   // console.log("sub", sub.getCreator());
// };

// export const transformers = {
//   baseV2Block_frameV2,
// };
