import type {
  RankiConfig,
  CreateContextFunction,
  ParseContext,
} from "@ranki/package-api";
// import { parse } from "./parse.mjs";

export const config: RankiConfig = {
  plugins: {
    standards: ["RankiConstantsV2", "RankiBaseV2"],
    requested: [
      "RankiParamsV2",
      "RankiFrameV2",
      "RankiFrameV1",
      // "RankiRichTextV2",
      // "RankiRichNumberV2",
      // "RankiRichStructureV2",
    ],
  },
  tokens: {
    sentence: {
      period: ".",
      question: "?",
      exclamation: "!",
    },
    paramsV2: {
      separator: {
        left: ",",
        right: ";",
      },
      key: {
        negation: "!",
      },
      operators: {
        assign: "=",
        append: "+=",
        remove: "-=",
      },
    },
    richNumberV2: {
      complexUnits: ["i", "j", "k"],
      infinity: ["inf", "INF"],
      pi: ["pi", "PI"],
      e: ["e", "E"],
      hexadecimal: ["x", "X"],
      octal: ["o", "O"],
      binary: ["b", "B"],
      decimal: ".",
      negative: "-",
      group: "_",
    },
  },
};

export const createContext: CreateContextFunction = (
  config,
  parser,
  parserPlugins,
) => {
  const context: ParseContext = {
    config,
    methods: {
      parser: (p) => parser,
      parserPlugins,
    },
  };
  return context;
};
