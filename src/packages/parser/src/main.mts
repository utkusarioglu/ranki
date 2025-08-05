import * as ohm from "ohm-js";
import type { Plugins } from "@ranki/package-plugins";
import { CONFIGURATION_KEYS, NODE_TYPES } from "@ranki/package-api/constants";
import type {
  AstNodeLeaf,
  AstNodeUnparsed,
  ApiStageParsed,
  AstNodeParameter,
  AstNodeIndefinite,
  AstNodeParentIndefinite,
  AstNodeParentDefinite,
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
  plugins: Plugins,
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
  plugins: Plugins,
): Promise<AstNodeDefinite> {
  // if (root.kind === "unparsed") {
  //   const parsed = await parseAstOhm(root, plugins);
  // }

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
      // parsed.children = children;
      // const definite = parsed as AstNodeDefinite;
      const definite = astNodeParentDefinite({
        children: children,
        type: parsed.type,
        parameters: parsed.parameters,
        attributes: parsed.attributes,
        configuration: parsed.configuration,
      });
      return definite;
  }

  // if (root.ohm) {
  //   root = await parseAstOhm(root, plugins);
  //   root.ohm = null;
  // }
  // if (parsed.children) {
  //   if (!root.children.map) {
  //     console.log(root.type, root.children);
  //   }
  //   const children = await Promise.all(
  //     root.children.map(async (child) => await parseAsync(child, plugins)),
  //   );
  //   root.children = children;
  // }
  // return root;
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
    .addOperation<AstNodeIndefinite>("eval(tokens)", createActions(plugins));
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
