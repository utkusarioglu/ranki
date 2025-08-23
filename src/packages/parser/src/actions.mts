import type { AstNodeIndefinite, RankiContext } from "@ranki/package-api";
import {
  astNodeLeaf,
  astNodeParentIndefinite,
  astNodeUnparsed,
  zip,
} from "@ranki/package-api/helpers";
import { PARSE_TYPES, CONFIGURATION_KEYS } from "@ranki/package-api/constants";
import * as ohm from "ohm-js";

const common: ohm.ActionDict<AstNodeIndefinite> = {
  fr(indentation, pre, slFrTagList, frConfig, frContent, post) {
    const tokens = this.args.tokens;
    const tagList = slFrTagList.eval(tokens);
    const tagListValues = tagList.children.children.map((v) => v.source);
    return astNodeUnparsed({
      type: PARSE_TYPES.frame,
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
};

export function createActions(
  context: RankiContext,
): ohm.ActionDict<AstNodeIndefinite> {
  return {
    ...common,
    document(whitespace, list) {
      return context.root.parsers.document.call(
        this,
        { whitespace, list },
        context,
      );
    },

    dir(pre, sb1, params, sArg, dirContent, sb2, post) {
      return context.root.parsers.directive.call(
        this,
        {
          pre,
          sb1,
          params,
          sArg,
          dirContent,
          sb2,
          post,
        },
        context,
      );
    },

    lineBreak(lb) {
      return astNodeLeaf({
        type: "lineBreak",
        source: lb.sourceString,
      });
    },
    clearance(spaces) {
      return astNodeLeaf({
        type: "clearance",
        source: spaces.sourceString,
      });
    },
    lineList(item, sep, rest) {
      const tokens = this.args.tokens;
      return astNodeParentIndefinite({
        type: "lineList",
        children: [
          item.eval(tokens),
          ...zip(sep.eval(tokens).children, rest.eval(tokens).children),
        ],
      });
    },
    lineContentList(item, sep, rest) {
      const tokens = this.args.tokens;
      return astNodeParentIndefinite({
        type: PARSE_TYPES.nonemptyList,
        children: [
          item.eval(tokens),
          ...zip(sep.eval(tokens).children, rest.eval(tokens).children),
        ],
      });
    },
    nonemptyListOf(item, sep, rest) {
      const tokens = this.args.tokens;
      return astNodeParentIndefinite({
        type: PARSE_TYPES.nonemptyList,
        children: [item.eval(tokens), ...rest.eval(tokens).children],
      });
    },
    wrap(wrapper, elem, _wrapper) {
      return astNodeLeaf({
        type: "WRAP",
        source: elem.sourceString,
      });
    },
    _iter(...children) {
      const tokens = this.args.tokens;
      return astNodeParentIndefinite({
        type: PARSE_TYPES.iter,
        children: children.map((v) => v.eval(tokens)),
      });
    },
    sl(spaces, elem) {
      const tokens = this.args.tokens;
      return astNodeParentIndefinite({
        type: "SPACES",
        children: elem.eval(tokens),
      });
    },
    frTag(tag) {
      return astNodeLeaf({
        type: PARSE_TYPES.frameTag,
        source: tag.sourceString,
      });
    },
    params(list, post) {
      const tokens = this.args.tokens;
      return astNodeParentIndefinite({
        type: PARSE_TYPES.parameters,
        children: list.eval(tokens),
      });
    },
    param_assignment(paramKey, sbA, paramValue) {
      const tokens = this.args.tokens;
      return astNodeParentIndefinite({
        type: PARSE_TYPES.parameter,
        parameters: [
          {
            keyword: paramKey.sourceString,
            values: paramValue.eval(tokens),
          },
        ],
        children: [],
      });
    },
    param_positive(paramKey) {
      return astNodeParentIndefinite({
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
        children: [],
      });
    },
    paramValueItemPrimitive_word(word) {
      return astNodeLeaf({
        type: "param_word",
        source: word.sourceString,
      });
    },
    paragraph(list, post) {
      const tokens = this.args.tokens;
      return astNodeParentIndefinite({
        type: PARSE_TYPES.paragraph,
        children: list.eval(tokens).children,
      });
    },
    line_default(indentation, list, spaces) {
      const tokens = this.args.tokens;
      return astNodeParentIndefinite({
        type: PARSE_TYPES.line,
        children: list.eval(tokens).children,
      });
    },
    lineWordPrimitive_mixed(word) {
      return astNodeLeaf({
        type: PARSE_TYPES.word,
        source: word.sourceString,
      });
    },
    line_heading(indentation, h, spaces1, line, spaces2) {
      const tokens = this.args.tokens;
      return astNodeParentIndefinite({
        type: PARSE_TYPES.heading,
        children: line.eval(tokens).children,
      });
    },
  };
}
