import { RankiPluginParser, RankiLanguageConfig } from "@ranki/package-api";

export const rankiConstantsV2ParserPlugin: RankiPluginParser = {
  type: "parser",
  version: "2.0.63",
  name: "RankiConstantsV2",
  dependencies: [],
  grammar: (c) => {
    return stringifyConfig(c.merged);
  },
  actions: () => ({}),
};

type Tokens = Record<string, boolean | number | string | string[]>;

function tokenize(config: RankiLanguageConfig["merged"]): Tokens {
  const tokens: Tokens = {
    root: "",
  };
  {
    tokens["frameV1"] = config.tokens.frameV1.delimiter;
  }
  {
    tokens["pause"] = config.tokens.frameV2.pause;
    tokens["directive"] = config.tokens.frameV2.directive;
    tokens["frame"] = config.tokens.frameV2.frame;
  }
  {
    tokens["sepLeft"] = config.tokens.paramsV2.separator.left;
    tokens["sepRight"] = config.tokens.paramsV2.separator.right;
    tokens["negation"] = config.tokens.paramsV2.key.negation;
    tokens["assign"] = config.tokens.paramsV2.operators.assign;
    tokens["append"] = config.tokens.paramsV2.operators.append;
    tokens["remove"] = config.tokens.paramsV2.operators.remove;
  }
  {
    tokens["align"] = config.tokens.richTextV2.line.align;
    tokens["h"] = config.tokens.richTextV2.line.heading;
    tokens["small"] = config.tokens.richTextV2.line.small;
  }
  {
    tokens["em"] = config.tokens.richTextV2.decoration.emphasis;
    tokens["b"] = config.tokens.richTextV2.decoration.bold;
    tokens["i"] = config.tokens.richTextV2.decoration.idiomatic;
    tokens["u"] = config.tokens.richTextV2.decoration.underline;
    tokens["abbr"] = config.tokens.richTextV2.decoration.abbreviation;
  }
  {
    tokens["esc"] = config.tokens.baseV2.escape;
  }
  {
    tokens["period"] = config.tokens.richTextV2.sentence.period;
    tokens["exclamation"] = config.tokens.richTextV2.sentence.exclamation;
    tokens["question"] = config.tokens.richTextV2.sentence.question;
  }
  {
    tokens["divider"] = config.tokens.richStructureV2.delimiter;
  }
  {
    tokens["complexToken"] = config.tokens.richNumberV2.complexUnits;
    tokens["infinityToken"] = config.tokens.richNumberV2.infinity;
    tokens["eToken"] = config.tokens.richNumberV2.e;
    tokens["piToken"] = config.tokens.richNumberV2.pi;
    tokens["hexadecimalToken"] = config.tokens.richNumberV2.hexadecimal;
    tokens["octalToken"] = config.tokens.richNumberV2.octal;
    tokens["binaryToken"] = config.tokens.richNumberV2.binary;
    tokens["decimalToken"] = config.tokens.richNumberV2.decimal;
    tokens["negativeToken"] = config.tokens.richNumberV2.negative;
    tokens["positive"] = config.tokens.richNumberV2.positive;
    tokens["groupToken"] = config.tokens.richNumberV2.group;
    tokens["rationalToken"] = config.tokens.richNumberV2.rational;
  }

  return tokens;
}

function stringifyConfig(config: RankiLanguageConfig["merged"]) {
  const tokens: Tokens = tokenize(config);

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
  console.log(configStr);
  return configStr;
}
