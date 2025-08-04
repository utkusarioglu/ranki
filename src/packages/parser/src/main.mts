import * as ohm from "ohm-js";
import type { Plugins } from "@ranki/package-plugins";
import { CONFIGURATION_KEYS, NODE_TYPES } from "@ranki/package-api/constants";
import type {
  AstNode,
  ApiStageParsed,
  AstNodeParameter,
} from "@ranki/package-api";
import grammarStr from "../assets/ohm/2.0.22.ohm?raw";
import { createActions } from "./actions.mjs";

type TokenValue = string | number | boolean;
type Tokens = Record<string, TokenValue>;

export function directiveParamsToDict(params: AstNodeParameter[]): Tokens {
  return params.reduce((a, { keyword, values }) => {
    if (values.length !== 1) {
      throw new Error(
        `Directive params can only accept single values: ${JSON.stringify(
          values,
        )}`,
      );
    }
    a[keyword] = values[0].value as TokenValue;
    return a;
  }, {} as Tokens);
}

function stringifyConfig(tokens: Tokens) {
  const configStr = [
    "RankiConfig {",
    ...Object.entries(tokens).map(([k, v]) => {
      const value = typeof v === "string" ? v.replace('"', '\\"') : v;
      return `  ${k} = "${value}"`;
    }),
    "}",
  ].join("\n");
  return configStr;
}

export function produceGrammar(tokens: Tokens) {
  const tokensSource = stringifyConfig(tokens);
  const rankiConfig = ohm.grammar(tokensSource);
  const rankiGrammar = ohm.grammar(grammarStr, {
    RankiConfig: rankiConfig,
  });
  return rankiGrammar;
}

const parseAstOhm = async (root: AstNode, plugins: Plugins) => {
  const tagListConfig = root.configuration.filter(
    (c) => c.keyword === CONFIGURATION_KEYS.frame.tag.list,
  );
  if (!tagListConfig) {
    throw new Error("Cannot find tag list config keyword");
  }
  const tagListValues = tagListConfig[0].values[0].toString();
  const parser = await plugins.getParser(tagListValues);
  const parsed = parser(root.ohm);
  return parsed;
};

async function parseAsync(root: AstNode, plugins: Plugins) {
  if (root.ohm) {
    root = await parseAstOhm(root, plugins);
    root.ohm = null;
  }
  if (root.children) {
    if (!root.children.map) {
      console.log(root.type, root.children);
    }
    const children = await Promise.all(
      root.children.map(async (child) => await parseAsync(child, plugins)),
    );
    root.children = children;
  }
  return root;
}

export async function parse(
  raw: string,
  plugins: Plugins,
  defaultTokens: Tokens,
): Promise<ApiStageParsed> {
  const rankiGrammar = produceGrammar(defaultTokens);
  const result = rankiGrammar.match(raw, "document");
  const root = rankiGrammar
    .createSemantics()
    .addOperation<AstNode>("eval(tokens)", createActions(plugins));
  if (result.succeeded()) {
    const rootParsed = root(result).eval(defaultTokens);
    const framed = await parseAsync(rootParsed, plugins);
    return {
      stage: "parsed",
      ast: framed,
    };
  } else {
    throw new Error(`Parse error:\n${result.message}`);
  }
}
