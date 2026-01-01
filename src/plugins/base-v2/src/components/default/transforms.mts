// import type { IDqmComponentTransformer } from "@dqm/package-dqm-api-v2";

// const PARENT = ["debug", "block", "container"];
// const LEAF = ["debug", "leaf", "container"];

// const baseV2RootBlock_structured: IDqmComponentTransformer = (trn) => {
//   trn.setChain(PARENT);
//   trn
//     .getAst()
//     .getSubtreeNodes()
//     .forEach((s) => trn.newTrnNode(s));
//   // trn
//   //   .getAst()
//   //   .getChildren()
//   //   .filter((v) => "node" === v.getCreationMethod())
//   //   .forEach((s) => trn.newTrnNode(s));
// };

// // const baseV2Block: IDqmComponentTransformer = (trn) => {};
// const baseV2Section_base: IDqmComponentTransformer = (trn) => {
//   trn.setChain(PARENT);
//   trn
//     .getAst()
//     .getChildren()
//     .filter((v) => "node" === v.getCreationMethod())
//     .forEach((s) => trn.newTrnNode(s));
//   // ast.getSubtreeNodes().forEach((s) => trn.newTrnNode(s));
//   // console.log("sub", sub.getCreator());
// };

// const baseV2P: IDqmComponentTransformer = (trn) => {
//   trn
//     .setChain(PARENT)
//     .getAst()
//     .getSubtreeNodes()
//     .forEach((s) => trn.newTrnNode(s));
//   // console.log("sub", sub.getCreator());
// };

// const baseV2Line: IDqmComponentTransformer = (trn) => {
//   trn.setChain(PARENT);
//   const ast = trn.getAst();
//   ast.getSubtreeNodes().forEach((s) => trn.newTrnNode(s));
// };

// const baseV2Lexemes: IDqmComponentTransformer = (trn) => {
//   trn.setChain(PARENT);
//   const ast = trn.getAst();
//   ast.getSubtreeNodes().forEach((s) => trn.newTrnNode(s));
// };

// const baseV2Decorated_base: IDqmComponentTransformer = (trn) => {
//   trn.setChain(PARENT);
//   const ast = trn.getAst();
//   ast.getSubtreeNodes().forEach((s) => trn.newTrnNode(s));
//   // console.log("sub", sub.getCreator());
// };

// const baseV2Word_base: IDqmComponentTransformer = (trn) => {
//   const ast = trn.getAst();
//   // const sub = ast.getSubtreeNodes()[0];
//   // console.log("sub", sub.getCreator());
//   trn.setChain(LEAF).setSource(ast.getSourceString());
// };

// export const transformers = {
//   baseV2RootBlock_structured,
//   baseV2P,
//   baseV2Line,
//   baseV2Lexemes,
//   baseV2Decorated_base,
//   baseV2Word_base,
//   baseV2Section_base,
// };
