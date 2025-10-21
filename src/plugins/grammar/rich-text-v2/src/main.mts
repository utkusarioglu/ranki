import { RankiGrammarTokens, RankiPluginGrammar } from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.63.ohm?raw";
import { actions } from "./actions.mjs";
import { validators } from "./validators.mjs";
import { transformers } from "./transformers.mjs";
import { RankiRichTextV2ParserPluginConfig } from "./types.mjs";

const config: RankiRichTextV2ParserPluginConfig = {
  tokens: {
    sentence: {
      period: ".",
      question: "?",
      exclamation: "!",
    },
    line: {
      align: "$",
      heading: "#",
      small: "_",
    },
    decoration: {
      emphasis: "+",
      bold: "*",
      idiomatic: "/",
      underline: "_",
      abbreviation: "@",
    },
  },
};

function tokenize(
  config: RankiRichTextV2ParserPluginConfig,
): RankiGrammarTokens {
  const tokens: RankiGrammarTokens = {};
  tokens["tRichTextV2DecorationEmphasis"] = config.tokens.decoration.emphasis;
  tokens["tRichTextV2DecorationBold"] = config.tokens.decoration.bold;
  tokens["tRichTextV2DecorationIdiomatic"] = config.tokens.decoration.idiomatic;
  tokens["tRichTextV2DecorationUnderline"] = config.tokens.decoration.underline;
  tokens["tRichTextV2DecorationAbbreviation"] =
    config.tokens.decoration.abbreviation;

  tokens["tRichTextV2SentencePeriod"] = config.tokens.sentence.period;
  tokens["tRichTextV2SentenceExclamation"] = config.tokens.sentence.exclamation;
  tokens["tRichTextV2SentenceQuestion"] = config.tokens.sentence.question;

  tokens["tRichTextV2LineAlign"] = config.tokens.line.align;
  tokens["tRichTextV2LineHeading"] = config.tokens.line.heading;
  tokens["tRichTextV2LineSmall"] = config.tokens.line.small;
  return tokens;
}

export const rankiRichTextV2ParserPlugin: RankiPluginGrammar<RankiRichTextV2ParserPluginConfig> =
  {
    type: "grammar",
    meta: {
      name: "RankiRichTextV2",
      version: "2.0.63",
    },
    dependencies: ["RankiBaseV2"],
    config,
    tokens: tokenize(config),
    grammar: () => grammar,
    validators,
    transformers,
    actions: () => actions,
  };
