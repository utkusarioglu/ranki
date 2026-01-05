import type { IDqmComponentTransformFunction } from "@dqm/package-dqm-api-v2";

type TF = IDqmComponentTransformFunction;

// @ts-ignore
const PARENT = ["debug", "block", "container"];
// @ts-ignore
const LEAF = ["debug", "leaf", "container"];

const ignored: TF = (trn) => {
  const ast = trn.getAst().getSubtreeNodes()[0];
  trn.setChain(["base", "v2", "ignored"]).setSource(ast.getSourceString());
};

const empty: TF = (trn) => {
  trn.setChain(["base", "v2", "ignored"]).setSource("");
};

const blockRoot: TF = (trn) => {
  trn.setChain(PARENT).newChild().setTransformClass("BASE_V2_SECTION_FILLED");
};

const section: TF = (trn) => {
  trn
    .setChain(["base", "v2", "section"])
    .newChild()
    .setTransformClass("BASE_V2_PARAGRAPH");
};

const paragraph: TF = (trn) => {
  trn
    .setChain(["base", "v2", "paragraph"])
    .newChild()
    .setTransformClass("BASE_V2_LINE");
};

const line: TF = (trn) => {
  trn
    .setChain(["base", "v2", "line"])
    .newChild()
    .setTransformClass("BASE_V2_LEXEME");
};
const lexeme: TF = (trn) => {
  trn
    .setChain(["base", "v2", "lexeme"])
    .newChild()
    .setTransformClass("BASE_V2_WORD");
};

const word: TF = (trn) => {
  const source = trn.getAst().getSourceString();
  trn.setChain(["base", "v2", "word"]).setSource(source);
};

const number: TF = (trn) => {
  const source = trn.getAst().getSourceString();
  trn.setChain(["base", "v2", "number"]).setSource(source);
};

export const transformers = {
  BASE_V2_WORD: word,
  BASE_V2_PARAGRAPH: paragraph,
  BASE_V2_EMPTY_DOCUMENT: empty,
  BASE_V2_ROOT_BLOCK_STRUCTURED: blockRoot,
  BASE_V2_SECTION_FILLED: section,
  BASE_V2_ROOT_BLOCK_IGNORED: ignored,
  BASE_V2_LINE: line,
  BASE_V2_LEXEME: lexeme,
  BASE_V2_NUMBER: number,
  // baseV2RootBlock_structured,
};
