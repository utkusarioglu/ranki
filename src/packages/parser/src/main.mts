import * as ohm from "ohm-js";
import { CONFIGURATION_KEYS } from "@ranki/package-api/constants";
import type {
  AstNodeDefinite,
  ApiStageParsed,
  AstNodeIndefinite,
  RankiContext,
  RankiConfig,
} from "@ranki/package-api";
import grammarStr from "../assets/ohm/2.0.22.ohm?raw";
// import grammarStr from "../assets/ohm/2.0.24.ohm?raw";
import { createActions } from "./actions.mjs";
import { astNodeParentDefinite } from "@ranki/package-api/helpers";
export { createActions } from "./actions.mjs";

function stringifyConfig(tokens: RankiConfig["tokens"]) {
  const configStr = [
    "RankiConfig {",
    ...Object.entries(tokens).map(([k, v]) => {
      const value = typeof v === "string" ? v.replace('"', '\\"') : v;
      return `  ${k} = "${value}"`;
    }),
    ...[
      // always overridden
      `  space := " " | "\\t"`,
      `  nl = "\\n" | "\\r"`,
    ],
    "}",
  ].join("\n");
  return configStr;
}

export function produceGrammar(tokens: RankiConfig["tokens"]) {
  const tokensSource = stringifyConfig(tokens);
  const rankiConfig = ohm.grammar(tokensSource);
  const rankiGrammar = ohm.grammar(grammarStr, {
    RankiConfig: rankiConfig,
  });
  return rankiGrammar;
}

const parseAstOhm = async (
  root: AstNodeIndefinite,
  context: RankiContext,
): Promise<AstNodeIndefinite> => {
  const tagListConfig = root.configuration.filter(
    (c) => c.keyword === CONFIGURATION_KEYS.frame.tag.list,
  );
  if (!tagListConfig) {
    throw new Error("Cannot find tag list config keyword");
  }
  const tagListValues = tagListConfig[0].values[0].toString();
  const parser = await context.plugins.getParser(tagListValues);
  const parsed = parser(root.ohm, context);
  return parsed;
};

async function parseAsync(
  root: AstNodeIndefinite,
  context: RankiContext,
): Promise<AstNodeDefinite> {
  let parsed: AstNodeIndefinite;
  if (root.kind === "unparsed") {
    parsed = await parseAstOhm(root, context);
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
        parsed.children.map(async (child) => await parseAsync(child, context)),
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
): Promise<ApiStageParsed> {
  const rankiGrammar = produceGrammar(context.config.tokens);
  const result = rankiGrammar.match(raw, "document");
  const root = rankiGrammar
    .createSemantics()
    .addOperation<AstNodeIndefinite>("eval(tokens)", createActions(context));
  if (result.succeeded()) {
    const rootParsed = root(result).eval(context.config.tokens);
    const framed = await parseAsync(rootParsed, context);
    return {
      stage: "parsed",
      ast: framed,
    };
  } else {
    throw new Error(`Parse error:\n${result.message}`);
  }
}
