import { RankiPluginParser } from "@ranki/package-api";
import grammar from "../assets/ohm/2.0.65.ohm?raw";
import { actions } from "./actions.mjs";

type Single = string;

export interface RankiParamsV2ParserPluginConfig {
  tokens: {
    separator: {
      param: Single;
      frame: Single;
    };
    key: {
      directive: Single;
      negation: Single;
    };
    operators: {
      assign: Single;
      append: Single;
      remove: Single;
    };
  };
}

export const rankiParamsV2ParserPlugin: RankiPluginParser<RankiParamsV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiParamsV2",
      version: "2.0.65",
    },
    dependencies: ["RankiConstantsV2"],
    config: {
      tokens: {
        separator: {
          param: ",",
          frame: ";",
        },
        key: {
          negation: "!",
          directive: "$",
        },
        operators: {
          assign: "=",
          append: "+=",
          remove: "-=",
        },
      },
    },
    grammar: () => grammar,
    actions: () => actions,
  };

export type { ArgsAndParamsV2, ParamsV2Spec, ParamV2 } from "./types.mjs";
export { applyV2Directives } from "./params.mjs";
