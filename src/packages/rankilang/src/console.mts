import type {
  RankiLanguageConfig,
  RankiLanguageUserConfig,
} from "@ranki/package-api";
import yaml from "yaml";
import * as fs from "node:fs";
import path from "node:path";
// import { parse } from "./parse.mjs";
// import { createContext } from "./context.mjs";
import { ParserPlugins } from "./plugins.mjs";

import { rankiConstantsV2ParserPlugin } from "@ranki/plugin-parser-constants-v2";
import { rankiBaseV2ParserPlugin } from "@ranki/plugin-parser-base-v2";
import { rankiParamsV2ParserPlugin } from "@ranki/plugin-parser-params-v2";
import { rankiFrameV2ParserPlugin } from "@ranki/plugin-parser-frame-v2";
import { rankiRichTextV2ParserPlugin } from "@ranki/plugin-parser-rich-text-v2";
import { rankiRichNumberV2ParserPlugin } from "@ranki/plugin-parser-rich-number-v2";
import { rankiRichStructureV2ParserPlugin } from "@ranki/plugin-parser-rich-structure-v2";
import { rankiFrameV1ParserPlugin } from "@ranki/plugin-parser-frame-v1";
import { RankiLang } from "./context.mjs";

const parserPlugins = new ParserPlugins();
[
  rankiBaseV2ParserPlugin,
  rankiConstantsV2ParserPlugin,
  rankiParamsV2ParserPlugin,
  rankiFrameV2ParserPlugin,
  rankiRichTextV2ParserPlugin,
  rankiRichNumberV2ParserPlugin,
  rankiRichStructureV2ParserPlugin,
  rankiFrameV1ParserPlugin,
].forEach((p) => parserPlugins.addPlugin(p));

export const userConfig: RankiLanguageUserConfig = {
  tags: [],
  plugins: {
    requested: [
      "RankiParamsV2",
      "RankiFrameV2",
      "RankiFrameV1",
      "RankiRichTextV2",
      "RankiRichNumberV2",
      "RankiRichStructureV2",
    ],
  },
  tokens: {
    baseV2: {
      escape: "\\",
    },
    frameV1: {
      delimiter: ":::",
    },
    frameV2: {
      pause: ",",
      directive: "%",
      frame: ":",
    },
    richTextV2: {
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
    richStructureV2: {
      delimiter: "~",
    },
    paramsV2: {
      separator: {
        param: ",",
        frame: ";",
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
        rational: "/",
        plusMinus: ["+-"],
        minusPlus: ["-+"],
      },
      number: {
        group: "_",
        decimal: ".",
      },
    },
  },
};

const languageConfig: RankiLanguageConfig = JSON.parse(
  JSON.stringify(userConfig),
);
languageConfig.merged.plugins.standards = ["RankiConstantsV2", "RankiBaseV2"];

const THROW_TESTS = "./assets/throw";
const throwTests = fs.readdirSync(THROW_TESTS);

function produceTests(count: number) {
  const serialized = throwTests.reduce((a, c) => {
    if (c.endsWith("ranki")) {
      const contents = fs.readFileSync(path.join(THROW_TESTS, c)).toString();
      const items = contents.split("\n---\n");
      a.push(...items);
    }
    return a;
  }, [] as string[]);

  const startIndex = Number.isNaN(count) ? 0 : serialized.length - count;
  return serialized.slice(startIndex, serialized.length);
}

function main(count: number) {
  const parsed = [];
  const lang = new RankiLang(languageConfig, parserPlugins);
  // const context = createContext(languageConfig, parserPlugins);

  produceTests(count).forEach((t) => {
    try {
      parsed.push(lang.parse({ default: t }));
      // parsed.push(context.methods.parser({ frameType: "null" })(context, t));
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });
  console.log(yaml.stringify(parsed));
}

main(+process.argv.at(-1));
