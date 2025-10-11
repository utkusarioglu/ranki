import { RankiPluginParser } from "@ranki/package-api-v2";
import { actions } from "./actions.mjs";
import grammar from "../assets/ohm/2.0.63.ohm?raw";

type Alternates = Single[];
type Single = string;

export interface RankiRichNumberV2ParserPluginConfig {
  tokens: {
    symbol: {
      complex: Alternates;
      infinity: Alternates;
      e: Alternates;
      pi: Alternates;
    };
    base: {
      hexadecimal: Alternates;
      octal: Alternates;
      binary: Alternates;
    };
    operator: {
      negative: Single;
      positive: Single;
      minusPlus: Alternates;
      plusMinus: Alternates;
      rational: Single;
    };
    number: {
      decimal: Single;
      group: Single;
    };
  };
}

export const rankiRichNumberV2ParserPlugin: RankiPluginParser<RankiRichNumberV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiRichNumberV2",
      version: "2.0.63",
    },
    dependencies: ["RankiBaseV2"],
    config: {
      tokens: {
        symbol: {
          complex: ["i", "j", "k"],
          infinity: ["inf", "INF"],
          pi: ["pi", "PI"],
          e: ["e", "E"],
        },
        base: {
          hexadecimal: ["x", "X"],
          octal: ["o", "O"],
          binary: ["b", "B"],
        },
        operator: {
          negative: "-",
          positive: "+",
          minusPlus: ["-+", "∓"],
          plusMinus: ["+-", "±"],
          rational: "/",
        },
        number: {
          decimal: ".",
          group: "_",
        },
      },
    },
    grammar: () => grammar,
    actions: () => actions,
  };
