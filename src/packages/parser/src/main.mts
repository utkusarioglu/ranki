import * as ohm from "ohm-js";
import * as fs from "node:fs";
import type { Plugins } from "@ranki/package-plugins";
import * as path from "node:path";
import type { AstNode, AstNodeParameter } from "@ranki/package-api";
import {
  CONFIGURATION_KEYS,
  CONFIGURATION_VALUES,
  NODE_TYPES,
  WARNINGS,
  astNode,
} from "@ranki/package-api";
// @ts-expect-error
import grammarStr from "../assets/ohm/2.0.22/grammar.ohm?raw";

const BASE = "/workdir/src/packages/parser/assets/ohm/2.0.22";

const DEFAULT_TOKENS = {
  // parameters
  negation: "!",
  sep_parameter: ",",
  sep_argument: ";",
  assignment: "=",
  quote_single: '\\"',
  quote_double: "'",

  // directive
  directive: "%%%",

  // frame
  frame: ":::",
  pause: "---",

  // html tags
  h: "#",
  em: "/",
  b: "*",
  i: "_",
};

type TokenValue = string | number | boolean;
type Tokens = Record<string, TokenValue>;

function directiveParamsToDict(params: AstNodeParameter[]): Tokens {
  return params.reduce((a, { keyword, values }) => {
    if (values.length !== 1) {
      throw new Error("Directive param accept single values");
    }
    a[keyword] = values[0].value as TokenValue;
    return a;
  }, {} as Tokens);
}

function stringifyConfig(tokens: Tokens) {
  const configStr = [
    "RankiConfig {",
    ...Object.entries(tokens).map(([k, v]) => `  ${k} = "${v}"`),
    "}",
  ].join("\n");
  return configStr;
}

function produceGrammar(tokens: Tokens) {
  // const grammarStr = fs.readFileSync(path.join(BASE, "grammar.ohm")).toString();
  const configStr = stringifyConfig(tokens);

  const rankiConfig = ohm.grammar(configStr);
  const rankiGrammar = ohm.grammar(grammarStr, {
    RankiConfig: rankiConfig,
  });
  return rankiGrammar;
}

function createActions(plugins: Plugins): ohm.ActionDict<AstNode> {
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
      const children = localSemantics(localMatch).eval(newTokens);

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
      const parser = plugins.getParser(tagListValues);
      const parsed = parser(frContent);
      return astNode({
        type: NODE_TYPES.frame,
        configuration: [
          {
            keyword: CONFIGURATION_KEYS.frame.tag.list,
            values: tagListValues,
          },
        ],
        children: [parsed],
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
  };
}

export function parse(raw: string, plugins: Plugins): AstNode {
  const rankiGrammar = produceGrammar(DEFAULT_TOKENS);
  const result = rankiGrammar.match(raw, "document");
  const semantics = rankiGrammar
    .createSemantics()
    .addOperation<AstNode>("eval(tokens)", createActions(plugins));
  if (result.succeeded()) {
    return semantics(result).eval(DEFAULT_TOKENS);
  } else {
    throw new Error("parse error");
  }
}
