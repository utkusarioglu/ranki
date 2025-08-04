import type { AstNode } from "@ranki/package-api";
import { astNode } from "@ranki/package-api/helpers";
import { NODE_TYPES, CONFIGURATION_KEYS } from "@ranki/package-api/constants";
import type { Plugins } from "@ranki/package-plugins";
import * as ohm from "ohm-js";
import { directiveParamsToDict, produceGrammar } from "./main.mjs";

export function createActions(plugins: Plugins): ohm.ActionDict<AstNode> {
  return {
    document(whitespace, list) {
      const tokens = this.args.tokens;
      return astNode({
        type: NODE_TYPES.document,
        children: list.eval(tokens).children,
      });
    },
    nonemptyListOf(item, sep, rest) {
      const tokens = this.args.tokens;
      return astNode({
        type: NODE_TYPES.nonemptyList,
        children: [item.eval(tokens), ...rest.eval(tokens).children],
      });
    },
    wrap(wrapper, elem, _wrapper) {
      return astNode({
        type: "WRAP",
        source: elem.sourceString,
      });
    },
    dir(pre, sb1, params, sArg, dirContent, sb2, post) {
      const tokens = this.args.tokens;
      const paramsParsed = params
        .eval(tokens)
        .children.children.map((v) => v.parameters)
        .reduce((a, c) => [...a, ...c], []);
      const dirTokens = directiveParamsToDict(paramsParsed);
      const newTokens = { ...tokens, ...dirTokens };
      const localGrammar = produceGrammar(newTokens);
      const localSemantics = localGrammar
        .createSemantics()
        .addOperation<AstNode>("eval(tokens)", createActions(plugins));
      const localMatch = localGrammar.match(
        dirContent.sourceString,
        "document",
      );
      const children = [localSemantics(localMatch).eval(newTokens)];

      return astNode({
        type: NODE_TYPES.directive,
        children,
        // source: "!coming!",
      });
    },
    _iter(...children) {
      const tokens = this.args.tokens;
      return astNode({
        type: NODE_TYPES.iter,
        children: children.map((v) => v.eval(tokens)),
      });
    },
    sl(spaces, elem) {
      const tokens = this.args.tokens;
      return astNode({
        type: "SPACES",
        children: elem.eval(tokens),
      });
    },
    frTag(tag) {
      return astNode({
        type: NODE_TYPES.frameTag,
        source: tag.sourceString,
      });
    },
    fr(indentation, pre, slFrTagList, frConfig, frContent, post) {
      const tokens = this.args.tokens;
      const tagList = slFrTagList.eval(tokens);
      const tagListValues = tagList.children.children.map((v) => v.source);
      return astNode({
        type: NODE_TYPES.frame,
        configuration: [
          {
            keyword: CONFIGURATION_KEYS.frame.tag.list,
            values: tagListValues,
          },
        ],
        ohm: frContent,
        // children: [parsed],
      });
    },
    params(list, post) {
      const tokens = this.args.tokens;
      return astNode({
        type: NODE_TYPES.parameters,
        children: list.eval(tokens),
      });
    },
    param_assignment(paramKey, sbA, paramValue) {
      const tokens = this.args.tokens;
      return astNode({
        type: NODE_TYPES.parameter,
        parameters: [
          {
            keyword: paramKey.sourceString,
            values: paramValue.eval(tokens),
          },
        ],
      });
    },
    param_positive(paramKey) {
      return astNode({
        type: "param_key",
        parameters: [
          {
            keyword: paramKey.sourceString,
            values: [
              {
                type: "boolean",
                value: true,
              },
            ],
          },
        ],
      });
    },
    paramValueItemPrimitive_word(word) {
      return astNode({
        type: "param_word",
        source: word.sourceString,
      });
    },
    paragraph(list, post) {
      const tokens = this.args.tokens;
      return astNode({
        type: NODE_TYPES.paragraph,
        children: list.eval(tokens).children,
      });
    },
    line_default(indentation, list, spaces) {
      const tokens = this.args.tokens;
      return astNode({
        type: NODE_TYPES.line,
        children: list.eval(tokens).children,
      });
    },
    lineWordPrimitive_mixed(word) {
      return astNode({
        type: NODE_TYPES.word,
        source: word.sourceString,
      });
    },
    line_heading(indentation, h, spaces1, line, spaces2) {
      const tokens = this.args.tokens;
      return astNode({
        type: "HEADING",
        children: line.eval(tokens).children,
      });
    },
  };
}
