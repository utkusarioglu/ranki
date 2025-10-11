import { RankiPluginParser } from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.63.ohm?raw";
import { actions } from "./actions.mjs";

type Single = string;

export interface RankiRichTextV2ParserPluginConfig {
  tokens: {
    sentence: {
      period: Single;
      question: Single;
      exclamation: Single;
    };
    line: {
      align: Single;
      heading: Single;
      small: Single;
    };
    decoration: {
      emphasis: Single;
      bold: Single;
      idiomatic: Single;
      underline: Single;
      abbreviation: Single;
    };
  };
}

export const rankiRichTextV2ParserPlugin: RankiPluginParser<RankiRichTextV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiRichTextV2",
      version: "2.0.63",
    },
    dependencies: ["RankiBaseV2"],
    config: {
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
    },
    grammar: () => grammar,
    actions: () => actions,
  };
