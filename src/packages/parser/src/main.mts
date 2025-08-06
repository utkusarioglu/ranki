import * as ohm from "ohm-js";
import { CONFIGURATION_KEYS, NODE_TYPES } from "@ranki/package-api/constants";
import type {
  ApiStageParsed,
  AstNodeParameter,
  AstNodeIndefinite,
  RankiContext,
  RankiPlugins,
} from "@ranki/package-api";
import grammarStr from "../assets/ohm/2.0.22.ohm?raw";
import { createActions } from "./actions.mjs";
import { AstNodeDefinite } from "../../api/lib/types/ast.mjs";
import { astNodeParentDefinite } from "@ranki/package-api/helpers";

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

const parseAstOhm = async (
  root: AstNodeIndefinite,
  plugins: RankiPlugins,
): Promise<AstNodeIndefinite> => {
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

async function parseAsync(
  root: AstNodeIndefinite,
  plugins: RankiPlugins,
): Promise<AstNodeDefinite> {
  let parsed: AstNodeIndefinite;
  if (root.kind === "unparsed") {
    parsed = await parseAstOhm(root, plugins);
    parsed.ohm = null;
  } else {
    parsed = root;
  }

  switch (parsed.kind) {
    case "leaf":
      return parsed;
    case "parent":
      // TODO this should be gone eventually
      if (!parsed.children.map) {
        console.log(parsed.type, parsed.children);
      }
      const children = await Promise.all(
        parsed.children.map(async (child) => await parseAsync(child, plugins)),
      );
      const definite = astNodeParentDefinite({
        children: children,
        type: parsed.type,
        parameters: parsed.parameters,
        attributes: parsed.attributes,
        configuration: parsed.configuration,
      });
      return definite;
  }
}

export async function parse(
  raw: string,
  context: RankiContext,
  // plugins: Plugins,
  // defaultTokens: Tokens,
): Promise<ApiStageParsed> {
  const rankiGrammar = produceGrammar(context.config.tokens);
  const result = rankiGrammar.match(raw, "document");
  const root = rankiGrammar
    .createSemantics()
    .addOperation<AstNodeIndefinite>(
      "eval(tokens)",
      createActions(context.plugins),
    );
  if (result.succeeded()) {
    const rootParsed = root(result).eval(context.config.tokens);
    const framed = await parseAsync(rootParsed, context.plugins);
    return {
      stage: "parsed",
      ast: framed,
    };
  } else {
    throw new Error(`Parse error:\n${result.message}`);
  }
}
