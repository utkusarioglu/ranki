import { RankiPluginParser, RankiLanguageConfig } from "@ranki/package-api";

export const rankiConstantsV2ParserPlugin: RankiPluginParser = {
  type: "parser",
  version: "2.0.64",
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
    tokens["tFrameV1Delimiter"] = config.tokens.frameV1.delimiter;
  }
  {
    tokens["tFrameV2Pause"] = config.tokens.frameV2.pause;
    tokens["tFrameV2Directive"] = config.tokens.frameV2.directive;
    tokens["tFrameV2Frame"] = config.tokens.frameV2.frame;
  }
  {
    tokens["tParamsV2SeparatorParam"] = config.tokens.paramsV2.separator.param;
    // TODO this doesn't appear in paramsV2. it does appear in Frame V2
    tokens["tParamsV2SeparatorFrame"] = config.tokens.paramsV2.separator.frame;
    tokens["tParamsV2Negation"] = config.tokens.paramsV2.key.negation;
    tokens["tParamsV2OperatorAssign"] = config.tokens.paramsV2.operators.assign;
    tokens["tParamsV2OperatorAppend"] = config.tokens.paramsV2.operators.append;
    tokens["tParamsV2OperatorRemove"] = config.tokens.paramsV2.operators.remove;
  }
  {
    tokens["tRichTextV2LineAlign"] = config.tokens.richTextV2.line.align;
    tokens["tRichTextV2LineHeading"] = config.tokens.richTextV2.line.heading;
    tokens["tRichTextV2LineSmall"] = config.tokens.richTextV2.line.small;
  }
  {
    tokens["tRichTextV2DecorationEmphasis"] =
      config.tokens.richTextV2.decoration.emphasis;
    tokens["tRichTextV2DecorationBold"] =
      config.tokens.richTextV2.decoration.bold;
    tokens["tRichTextV2DecorationIdiomatic"] =
      config.tokens.richTextV2.decoration.idiomatic;
    tokens["tRichTextV2DecorationUnderline"] =
      config.tokens.richTextV2.decoration.underline;
    tokens["tRichTextV2DecorationAbbreviation"] =
      config.tokens.richTextV2.decoration.abbreviation;
  }
  {
    tokens["tBaseV2Escape"] = config.tokens.baseV2.escape;
  }
  {
    tokens["tRichTextV2SentencePeriod"] =
      config.tokens.richTextV2.sentence.period;
    tokens["tRichTextV2SentenceExclamation"] =
      config.tokens.richTextV2.sentence.exclamation;
    tokens["tRichTextV2SentenceQuestion"] =
      config.tokens.richTextV2.sentence.question;
  }
  {
    tokens["tRichStructureV2Delimiter"] =
      config.tokens.richStructureV2.delimiter;
  }
  {
    tokens["tRichNumberV2SymbolComplex"] =
      config.tokens.richNumberV2.symbol.complex;
    tokens["tRichNumberV2SymbolInfinity"] =
      config.tokens.richNumberV2.symbol.infinity;
    tokens["tRichNumberV2SymbolE"] = config.tokens.richNumberV2.symbol.e;
    tokens["tRichNumberV2SymbolPi"] = config.tokens.richNumberV2.symbol.pi;
    tokens["tRichNumberV2BaseHexadecimal"] =
      config.tokens.richNumberV2.base.hexadecimal;
    tokens["tRichNumberV2BaseOctal"] = config.tokens.richNumberV2.base.octal;
    tokens["tRichNumberV2BaseBinary"] = config.tokens.richNumberV2.base.binary;
    tokens["tRichNumberV2OperatorNegative"] =
      config.tokens.richNumberV2.operator.negative;
    tokens["tRichNumberV2OperatorPositive"] =
      config.tokens.richNumberV2.operator.positive;
    tokens["tRichNumberV2OperatorMinusPlus"] =
      config.tokens.richNumberV2.operator.minusPlus;
    tokens["tRichNumberV2OperatorPlusMinus"] =
      config.tokens.richNumberV2.operator.plusMinus;
    tokens["tRichNumberV2OperatorRational"] =
      config.tokens.richNumberV2.operator.rational;
    tokens["tRichNumberV2NumberDecimal"] =
      config.tokens.richNumberV2.number.decimal;
    tokens["tRichNumberV2NumberGroup"] =
      config.tokens.richNumberV2.number.group;
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
