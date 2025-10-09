import { RankiPluginParser, RankiLanguageConfig } from "@ranki/package-api";

export interface RankiConstantsV2ParserPluginConfig {}

export const rankiConstantsV2ParserPlugin: RankiPluginParser<RankiConstantsV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      version: "2.0.64",
      name: "RankiConstantsV2",
    },
    dependencies: [],
    config: {},
    grammar: (c) => {
      return stringifyConfig(c.merged);
    },
    actions: () => ({}),
  };

type Tokens = Record<string, boolean | number | string | string[]>;

// function tokenize(config: RankiLanguageConfig["merged"]): Tokens {
function tokenize(config: any): Tokens {
  const tokens: Tokens = {
    root: "",
  };
  {
    tokens["tFrameV1Delimiter"] =
      config.plugins.config.RankiFrameV1.tokens.delimiter;
  }
  {
    tokens["tFrameV2Pause"] = config.plugins.config.RankiFrameV2.tokens.pause;
    tokens["tFrameV2Directive"] =
      config.plugins.config.RankiFrameV2.tokens.directive;
    tokens["tFrameV2Frame"] = config.plugins.config.RankiFrameV2.tokens.frame;
  }
  {
    tokens["tParamsV2SeparatorParam"] =
      config.plugins.config.RankiParamsV2.tokens.separator.param;
    tokens["tParamsV2DirectiveParam"] =
      config.plugins.config.RankiParamsV2.tokens.key.directive;
    // TODO this doesn't appear in paramsV2. it does appear in Frame V2
    tokens["tParamsV2SeparatorFrame"] =
      config.plugins.config.RankiParamsV2.tokens.separator.frame;
    tokens["tParamsV2Negation"] =
      config.plugins.config.RankiParamsV2.tokens.key.negation;
    tokens["tParamsV2OperatorAssign"] =
      config.plugins.config.RankiParamsV2.tokens.operators.assign;
    tokens["tParamsV2OperatorAppend"] =
      config.plugins.config.RankiParamsV2.tokens.operators.append;
    tokens["tParamsV2OperatorRemove"] =
      config.plugins.config.RankiParamsV2.tokens.operators.remove;
  }
  {
    tokens["tRichTextV2LineAlign"] =
      config.plugins.config.RankiRichTextV2.tokens.line.align;
    tokens["tRichTextV2LineHeading"] =
      config.plugins.config.RankiRichTextV2.tokens.line.heading;
    tokens["tRichTextV2LineSmall"] =
      config.plugins.config.RankiRichTextV2.tokens.line.small;
  }
  {
    tokens["tRichTextV2DecorationEmphasis"] =
      config.plugins.config.RankiRichTextV2.tokens.decoration.emphasis;
    tokens["tRichTextV2DecorationBold"] =
      config.plugins.config.RankiRichTextV2.tokens.decoration.bold;
    tokens["tRichTextV2DecorationIdiomatic"] =
      config.plugins.config.RankiRichTextV2.tokens.decoration.idiomatic;
    tokens["tRichTextV2DecorationUnderline"] =
      config.plugins.config.RankiRichTextV2.tokens.decoration.underline;
    tokens["tRichTextV2DecorationAbbreviation"] =
      config.plugins.config.RankiRichTextV2.tokens.decoration.abbreviation;
  }
  {
    tokens["tBaseV2Escape"] = config.plugins.config.RankiBaseV2.tokens.escape;
  }
  {
    tokens["tRichTextV2SentencePeriod"] =
      config.plugins.config.RankiRichTextV2.tokens.sentence.period;
    tokens["tRichTextV2SentenceExclamation"] =
      config.plugins.config.RankiRichTextV2.tokens.sentence.exclamation;
    tokens["tRichTextV2SentenceQuestion"] =
      config.plugins.config.RankiRichTextV2.tokens.sentence.question;
  }
  {
    tokens["tRichStructureV2Delimiter"] =
      config.plugins.config.RankiRichStructureV2.tokens.delimiter;
  }
  {
    tokens["tRichNumberV2SymbolComplex"] =
      config.plugins.config.RankiRichNumberV2.tokens.symbol.complex;
    tokens["tRichNumberV2SymbolInfinity"] =
      config.plugins.config.RankiRichNumberV2.tokens.symbol.infinity;
    tokens["tRichNumberV2SymbolE"] =
      config.plugins.config.RankiRichNumberV2.tokens.symbol.e;
    tokens["tRichNumberV2SymbolPi"] =
      config.plugins.config.RankiRichNumberV2.tokens.symbol.pi;
    tokens["tRichNumberV2BaseHexadecimal"] =
      config.plugins.config.RankiRichNumberV2.tokens.base.hexadecimal;
    tokens["tRichNumberV2BaseOctal"] =
      config.plugins.config.RankiRichNumberV2.tokens.base.octal;
    tokens["tRichNumberV2BaseBinary"] =
      config.plugins.config.RankiRichNumberV2.tokens.base.binary;
    tokens["tRichNumberV2OperatorNegative"] =
      config.plugins.config.RankiRichNumberV2.tokens.operator.negative;
    tokens["tRichNumberV2OperatorPositive"] =
      config.plugins.config.RankiRichNumberV2.tokens.operator.positive;
    tokens["tRichNumberV2OperatorMinusPlus"] =
      config.plugins.config.RankiRichNumberV2.tokens.operator.minusPlus;
    tokens["tRichNumberV2OperatorPlusMinus"] =
      config.plugins.config.RankiRichNumberV2.tokens.operator.plusMinus;
    tokens["tRichNumberV2OperatorRational"] =
      config.plugins.config.RankiRichNumberV2.tokens.operator.rational;
    tokens["tRichNumberV2NumberDecimal"] =
      config.plugins.config.RankiRichNumberV2.tokens.number.decimal;
    tokens["tRichNumberV2NumberGroup"] =
      config.plugins.config.RankiRichNumberV2.tokens.number.group;
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
  return configStr;
}
