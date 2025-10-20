import type { RankiLanguageProvidedConfig } from "@ranki/package-api-v2";
import yaml from "yaml";
import * as fs from "node:fs";
import path from "node:path";
import { RankiLang } from "@ranki/package-rankilang-v2";

import { rankiConstantsV2ParserPlugin } from "@ranki/plugin-grammar-constants-v2";
import { rankiBaseV2ParserPlugin } from "@ranki/plugin-parser-base-v2";
import { rankiParamsV2ParserPlugin } from "@ranki/plugin-grammar-params-v2";
import { rankiFrameV2ParserPlugin } from "@ranki/plugin-parser-frame-v2";
import { rankiRichTextV2ParserPlugin } from "@ranki/plugin-grammar-rich-text-v2";
import { rankiRichNumberV2ParserPlugin } from "@ranki/plugin-grammar-rich-number-v2";
import { rankiRichStructureV2ParserPlugin } from "@ranki/plugin-grammar-rich-structure-v2";
import { rankiFrameV1ParserPlugin } from "@ranki/plugin-parser-frame-v1";
import { rankiFrameV2ComponentsPluginDom } from "@ranki/plugin-component-frame-v2-dom";

export const providedConfig = {
  tags: [],
  content: {
    prefix: "",
    suffix: "",
  },
  stage: "ast",
  plugins: {
    requested: [
      "RankiParamsV2",
      "RankiFrameV2",
      // "RankiFrameV1",
      // "RankiRichTextV2",
      // "RankiRichNumberV2",
      // "RankiRichStructureV2",
    ],
  },
} as RankiLanguageProvidedConfig;

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
  const lang = new RankiLang(
    {
      parsers: [
        rankiBaseV2ParserPlugin,
        rankiConstantsV2ParserPlugin,
        rankiParamsV2ParserPlugin,
        rankiFrameV2ParserPlugin,
        rankiRichTextV2ParserPlugin,
        rankiRichNumberV2ParserPlugin,
        rankiRichStructureV2ParserPlugin,
        rankiFrameV1ParserPlugin,
      ],
      components: [rankiFrameV2ComponentsPluginDom],
    },
    [providedConfig],
  );

  produceTests(count).forEach((test) => {
    try {
      parsed.push(lang.parse({ default: test }));
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });
  console.log(yaml.stringify(JSON.parse(JSON.stringify(parsed))));
}

main(+process.argv.at(-1));
