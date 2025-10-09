export type Tokens = Record<string, boolean | number | string | string[]>;

export function stringifyConfig(
  className: string,
  tokens: Tokens,
  // config: RankiLanguageConfig["merged"],
) {
  // const tokens: Tokens = tokenize(config);

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
    `${className} {`,
    ...Object.entries(tokens).map(([k, v]) => {
      const values = stringifyValues(v);
      return `  ${k} = ${values}`;
    }),
    "}",
  ].join("\n");
  return configStr;
}
