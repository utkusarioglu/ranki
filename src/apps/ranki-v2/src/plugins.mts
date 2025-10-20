import { rankiConstantsV2ParserPlugin } from "@ranki/plugin-grammar-constants-v2";
import { rankiBaseV2ParserPlugin } from "@ranki/plugin-parser-base-v2";
import { rankiParamsV2ParserPlugin } from "@ranki/plugin-grammar-params-v2";
import { rankiFrameV2ParserPlugin } from "@ranki/plugin-parser-frame-v2";
import { rankiRichTextV2ParserPlugin } from "@ranki/plugin-grammar-rich-text-v2";
import { rankiRichNumberV2ParserPlugin } from "@ranki/plugin-grammar-rich-number-v2";
import { rankiRichStructureV2ParserPlugin } from "@ranki/plugin-grammar-rich-structure-v2";
import { rankiFrameV1ParserPlugin } from "@ranki/plugin-parser-frame-v1";
import { ParserPlugins } from "@ranki/package-rankilang-v2";

export const parserPlugins = new ParserPlugins();
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
