import type { IDqmComponentTransformFunction } from "@dqm/package-dqm-api-v2";

// @ts-ignore
const PARENT = ["debug", "block", "container"];
const LEAF = ["debug", "leaf", "container"];

// const baseV2RootBlock_structured
const blockRoot: IDqmComponentTransformFunction = (trn) => {
  trn
    .setChain(PARENT)
    .newChild()
    .setChain(PARENT)
    .newChild()
    .setChain(PARENT)
    .newChild()
    // .setChain(PARENT)
    .setTransformClass("BASE_V2_SECTION_BASE");
};

const section: IDqmComponentTransformFunction = (trn) => {
  const ast = trn.getAst();
  trn
    .setChain(PARENT)
    .newChild()
    // .setChain(PARENT)
    // .newChild()
    // .setChain(PARENT)
    // .newChild()
    .setChain(LEAF)
    .setSource(ast.getSourceString());
};

export const transformers = {
  // "base.v2.default:block": blockRoot,
  BASE_V2_ROOT_BLOCK_STRUCTURED: blockRoot,
  BASE_V2_SECTION_BASE: section,
  // baseV2RootBlock_structured,
};
