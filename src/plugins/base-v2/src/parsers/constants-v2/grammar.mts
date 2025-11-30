import type { DqmGrammarTokens, DqmConfig } from "@ranki/package-dqm-api-v2";

export function buildGrammar(merged: DqmConfig) {
  const tokens: DqmGrammarTokens = {};

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
