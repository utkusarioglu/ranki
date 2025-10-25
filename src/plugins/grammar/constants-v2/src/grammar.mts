import type {
  RankiLanguageConfig,
  RankiGrammarTokens,
} from "@ranki/package-api-v2";

export function buildGrammar(allConfig: RankiLanguageConfig) {
  const merged = allConfig.merged;
  const tokens: RankiGrammarTokens = {};

  Object.entries(merged.grammar.tokens).forEach(([src, list]) => {
    Object.entries(list).forEach(([n, v]) => {
      if (tokens.hasOwnProperty(n)) {
        throw new Error(
          `TOKEN FROM ${src} NAMED ${n} ALREADY ENLISTED FOR RankiConstantsV2`,
        );
      }
      tokens[n] = v;
    });
  });

  const stringifyValue = (v: string | number | boolean) => {
    return typeof v === "string" ? v.replace('"', '\\"') : v.toString();
  };

  const stringifyValues = (values: string[] | string | number | boolean) => {
    if (Array.isArray(values)) {
      return values
        .map((v) => stringifyValue(v))
        .map((v) => `"${v}"`)
        .join(" | ");
    }
    return `"${stringifyValue(values)}"`;
  };

  const configStr = [
    "RankiConstantsV2 {",
    ...Object.entries(tokens).map(([k, v]) => {
      const values = stringifyValues(v);
      return `  ${k} = ${values}`;
    }),
    "}",
  ].join("\n");
  return configStr;
}
