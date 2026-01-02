import type { IDqmComponentTransformFunction } from "@dqm/package-dqm-api-v2";

// @ts-ignore
const PARENT = ["debug", "block", "container"];
const LEAF = ["debug", "leaf", "container"];

// const baseV2RootBlock_structured
const blockRoot: IDqmComponentTransformFunction = (trn) => {
  // const ast = trn.getRootAst();
  // console.log(ast.getSubtreeNodes().map((v) => v.getCreator()));
  const c = trn.setChain(PARENT).newChild().setChain(PARENT);
  trn.accepts("base.v2.default:section", c);
  // .setChain(PARENT)
  // .newChild()
  // .setChain(PARENT)
  // .newChild()
  // .setChain(LEAF)
  // .setSource(ast.getSourceString());
};

const section: IDqmComponentTransformFunction = (trn) => {
  const ast = trn.getRootAst();
  console.log(ast.getSubtreeNodes().map((v) => v.getCreator()));
  trn
    .setChain(PARENT)
    .newChild()
    .setChain(PARENT)
    .newChild()
    .setChain(PARENT)
    .newChild()
    .setChain(LEAF)
    .setSource(ast.getSourceString());
};

export const transformers = {
  "base.v2.default:block": blockRoot,
  "base.v2.default:section": section,
  // baseV2RootBlock_structured,
};
