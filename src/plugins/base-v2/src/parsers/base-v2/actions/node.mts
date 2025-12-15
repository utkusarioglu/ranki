import type { ChainList } from "@dqm/package-dqm-api-v2";
import type { IParam, IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { buildContext, grabAst } from "@dqm/package-plugin-utils";

const COMPONENT: ChainList = [["base", "v2", "default"]];
const PARAMS: IParam[] = [];

export const node: IAstNodeActionDict = {
  _iter(...children) {
    return children.map((ch) => ch.separator(buildContext(this)));
  },

  baseV2RootBlock_ignored(ignore, wm, rest) {
    return grabAst(this)
      .newAst(this)
      .newCpx((cpx) => cpx.setParams(PARAMS).setIdList(COMPONENT))
      .setDirection("block")
      .pushNodes(["token", ignore])
      .pushNodes(["space", wm])
      .pushNodes(["node", rest]);
  },

  baseV2Ignored(ignored) {
    return grabAst(this).newAst(this).pushIgnoredNodes(ignored);
  },

  baseV2Section_empty(all) {
    return grabAst(this)
      .newAst(this)
      .setDirection("inline")
      .pushIgnoredNodes(all);
  },

  baseV2RootBlock_structured(whitespace1, structure, whitespace2) {
    return grabAst(this)
      .newAst(this)
      .newCpx((cpx) => cpx.setParams(PARAMS).setIdList(COMPONENT))
      .setDirection("block")
      .pushNodes(["space", whitespace1])
      .pushNodes(["node", structure])
      .pushNodes(["space", whitespace2]);
  },

  baseV2Section_base(block, blockSep, block2) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", block])
      .pushNodes(["token", blockSep], ["node", block2]);
  },

  baseV2P(line1, nl, line2) {
    return grabAst(this)
      .newAst(this)
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
      .pushNodes(["space", indentation1])
      .pushNodes(["token", lineModifiers])
      .pushNodes(["node", lexemes])
      .pushNodes(["space", wi]);
  },

  baseV2Lexemes(lexeme1, clearance, lexeme2) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", lexeme1])
      .pushNodes(["space", clearance], ["node", lexeme2]);
  },

  baseV2Decorated_base(word, wordEnd) {
    return grabAst(this)
      .newAst(this)
      .pushNodes(["node", word])
      .pushNodes(["token", wordEnd]);
  },

  baseV2Decorated_fallback(word, wordEnd) {
    return grabAst(this).newAst(this).pushIgnoredNodes(word, wordEnd);
  },

  baseV2Word_base(base) {
    return grabAst(this).newAst(this).pushIgnoredNodes(base);
  },

  baseV2Word_baseV2Number(number) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(number)
      .setLeafViewDecoder("number", (v) => ({ value: +v }));
  },

  hWrapped(token1, content, token2) {
    return grabAst(this).newAst(content).pushIgnoredNodes(token1, token2);
    // .pushNodes(["token", token1])
    // .pushNodes(["node", content])
    // .pushNodes(["token", token2]);
  },

  // hWrappedContent(one) {
  //   return grabAst(this).newAst(this).pushIgnoredNodes(one);
  // },
};
