import type { IDqmPluginRenderer } from "@dqm/package-dqm-api-v2";
import { paragraph } from "./paragraph/paragraph.mjs";
import { ignored } from "./ignored/ignored.mjs";
import { section } from "./section/section.mjs";
import { line } from "./line/line.mjs";
import { lexeme } from "./lexeme/lexeme.mjs";
import { decorated } from "./decorated/decorated.mjs";
import { word } from "./word/word.mjs";
import { whitespace } from "./whitespace/whitespace.mjs";
import { number } from "./number/number.mjs";

export const baseV2Renderer: IDqmPluginRenderer = {
  type: "renderer",
  meta: {
    name: "BaseV2",
    engine: "DqmStaticRenderer",
    description: "Provides some signature elements for BaseV2",
    version: "0.0.0",
  },
  list: [
    paragraph,
    ignored,
    section,
    line,
    lexeme,
    decorated,
    word,
    whitespace,
    number,
  ],
};
