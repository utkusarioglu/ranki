import type {
  AstNodeIndefinite,
  PluginComponentParser,
} from "@ranki/package-api";
import { PARSE_TYPES } from "@ranki/package-api/constants";
import { astNodeParentIndefinite } from "@ranki/package-api/helpers";
import type { AstNodeParameter, RankiConfig } from "@ranki/package-api";

function directiveParamsToDict(
  params: AstNodeParameter[],
): RankiConfig["tokens"] {
  return params.reduce((a, { keyword, values }) => {
    if (values.length !== 1) {
      throw new Error(
        `Directive params can only accept single values: ${JSON.stringify(
          values,
        )}`,
      );
    }
    a[keyword] = values[0].value;
    return a;
  }, {} as RankiConfig["tokens"]);
}

export const parser: PluginComponentParser = (
  { pre, sb1, params, sArg, dirContent, sb2, post },
  context,
) => {
  // const tokens = this.args.tokens;
  const paramsParsed = params
    .eval(context.config.tokens)
    .children.children.map((v) => v.parameters)
    .reduce((a, c) => [...a, ...c], []);
  const dirTokens = directiveParamsToDict(paramsParsed);
  const newTokens = { ...context.config.tokens, ...dirTokens };
  const localGrammar = context.language.produceGrammar(newTokens);
  // @ts-expect-error
  const localSemantics = localGrammar
    .createSemantics()
    .addOperation<AstNodeIndefinite>(
      "eval(tokens)",
      context.language.createActions(context),
    );
  const localMatch = localGrammar.match(dirContent.sourceString, "document");
  const children = [localSemantics(localMatch).eval(newTokens)];

  return astNodeParentIndefinite({
    type: PARSE_TYPES.directive,
    children,
    // source: "!coming!",
  });
};
