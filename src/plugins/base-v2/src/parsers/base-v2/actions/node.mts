import type { ChainList } from "@dqm/package-dqm-api-v2";
import type {
  IAstParamNode,
  IAstNodeActionDict,
} from "@dqm/package-dqm-api-v2";
import { buildContext, grabAst } from "@dqm/package-plugin-utils";

const COMPONENT: ChainList = [["base", "v2", "default"]];
const PARAMS: IAstParamNode[] = [];

export const node: IAstNodeActionDict = {
  _iter(...children) {
    return children.map((ch) => ch.separator(buildContext(this)));
  },

  baseV2RootBlock_ignored(ignore, wm, rest) {
    return grabAst(this)
      .newAst(this)
      .newCpx((cpx) => cpx.setAstParams(PARAMS).setIdList(COMPONENT))
      .setDirection("block")
      .setTransformClass("BASE_V2_ROOT_BLOCK_IGNORED")
      .pushNodes(["token", ignore])
      .pushNodes(["space", wm])
      .pushNodes(["node", rest]);
  },

  baseV2Ignored(ignored) {
    return grabAst(this).newAst(this).pushIgnoredNodes(ignored);
  },

  baseV2Section_empty(all) {
    return grabAst(this)
      .setTransformClass("BASE_V2_EMPTY_DOCUMENT")
      .newAst(this)
      .setDirection("inline")
      .pushIgnoredNodes(all);
  },

  baseV2RootBlock_structured(whitespace1, structure, whitespace2) {
    return (
      grabAst(this)
        .newAst(this)
        .newCpx((cpx) => cpx.setAstParams(PARAMS).setIdList(COMPONENT))
        // .setTransformClass("BASE_V2_ROOT_BLOCK_STRUCTURED")
        .setDirection("block")
        .pushNodes(["space", whitespace1])
        .pushNodes(["node", structure])
        .pushNodes(["space", whitespace2])
    );
  },

  baseV2Section_base(block, blockSep, block2) {
    return grabAst(this)
      .newAst(this)
      .setTransformClass("BASE_V2_SECTION_FILLED")
      .pushNodes(["node", block])
      .pushNodes(["token", blockSep], ["node", block2]);
  },

  baseV2P(line1, nl, line2) {
    return grabAst(this)
      .newAst(this)
      .setTransformClass("BASE_V2_PARAGRAPH")
      .pushNodes(["node", line1])
      .pushNodes(["space", nl], ["node", line2]);
  },

  baseV2RootLine(wi1, lexemes, wi2) {
    return grabAst(this)
      .newAst(this)
      .setDirection("inline")
      .pushNodes(["space", wi1])
      .pushNodes(["node", lexemes])
      .pushNodes(["space", wi2]);
  },

  // TODO line modifiers
  baseV2Line(indentation1, lineModifiers, lexemes, wi) {
    return grabAst(this)
      .newAst(this)
      .setDirection("inline")
      .setTransformClass("BASE_V2_LINE")
      .pushNodes(["space", indentation1])
      .pushNodes(["token", lineModifiers])
      .pushNodes(["node", lexemes])
      .pushNodes(["space", wi]);
  },

  baseV2Lexemes(lexeme1, clearance, lexeme2) {
    return grabAst(this)
      .newAst(this)
      .setTransformClass("BASE_V2_LEXEME")
      .pushNodes(["node", lexeme1])
      .pushNodes(["space", clearance], ["node", lexeme2]);
  },

  baseV2Decorated_base(word, wordEnd) {
    return grabAst(this)
      .newAst(this)
      .setTransformClass("BASE_V2_WORD")
      .pushNodes(["node", word])
      .pushNodes(["token", wordEnd]);
  },

  baseV2Decorated_fallback(word, wordEnd) {
    return (
      grabAst(this)
        .newAst(this)
        // .setTransformClass("BASE_V2_WORD")
        .pushIgnoredNodes(word, wordEnd)
    );
  },

  baseV2Word_base(base) {
    return (
      grabAst(this)
        .newAst(this)
        // .setTransformClass("BASE_V2_WORD")
        .pushIgnoredNodes(base)
    );
  },

  baseV2Word_baseV2Number(number) {
    return (
      grabAst(this)
        .newAst(this)
        // .setTransformClass("BASE_V2_NUMBER")
        .pushIgnoredNodes(number)
        .setLeafViewDecoder("number", (v) => ({ value: +v }))
    );
  },

  hWrapped(token1, content, token2) {
    return grabAst(this).newAst(content).pushIgnoredNodes(token1, token2);
  },
};
