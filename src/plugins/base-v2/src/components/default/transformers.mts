import type {
  IAstNode,
  IDqmComponentTransformFunction,
} from "@dqm/package-dqm-api-v2";

type TF = IDqmComponentTransformFunction;

// @ts-ignore
const PARENT = ["debug", "block", "container"];
// @ts-ignore
const LEAF = ["debug", "leaf", "container"];

const ignored: TF = async (trn) => {
  const ast = trn.getAst().getSubtreeNodes()[0];
  trn.setChain(["base", "v2", "ignored"]).setSource(ast.getSourceString());
};

const empty: TF = async (trn) => {
  trn.setChain(["base", "v2", "ignored"]).setSource("");
};

const section: TF = async (trn) => {
  trn.setChain(["base", "v2", "section"]).setAsMount();
};

const paragraph: TF = async (trn) => {
  trn.setChain(["base", "v2", "paragraph"]).setAsMount();
};

const line: TF = async (trn) => {
  trn.setChain(["base", "v2", "line"]).setAsMount();
};
const lexeme: TF = async (trn) => {
  trn.setChain(["base", "v2", "lexeme"]).setAsMount();
};

const decorated: TF = async (trn) => {
  const ast = trn.getAst();
  trn.setChain(["base", "v2", "decorated"]);
  trn.newChild().setChain(["base", "v2", "decorated"]).setAsMount();
  trn
    .newChild()
    .setChain(["base", "v2", "whitespace"])
    .setSource(trailingSpace(ast));
};

const word: TF = async (trn) => {
  trn
    .setChain(["base", "v2", "word"])
    .setSource(trn.getAst().getSourceString());
};

const number: TF = async (trn) => {
  trn
    .setChain(["base", "v2", "number"])
    .setSource(trn.getAst().getSourceString());
};

// @ts-ignore
function trailingSpace(ast: IAstNode): string {
  const prev = ast.getAstNext();
  if (prev) {
    const method = prev.getCreationMethod();
    if (method === "space") {
      return prev.getSourceString();
    }
  }
  return "";
}

export const transformers = {
  BASE_V2_WORD: word,
  BASE_V2_PARAGRAPH: paragraph,
  BASE_V2_EMPTY_DOCUMENT: empty,
  // BASE_V2_ROOT_BLOCK_STRUCTURED: blockRoot,
  BASE_V2_SECTION_FILLED: section,
  BASE_V2_ROOT_BLOCK_IGNORED: ignored,
  BASE_V2_LINE: line,
  BASE_V2_LEXEME: lexeme,
  BASE_V2_NUMBER: number,
  BASE_V2_DECORATED: decorated,
};
