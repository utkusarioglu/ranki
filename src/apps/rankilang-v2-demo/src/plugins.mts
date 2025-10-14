import { rankiConstantsV2ParserPlugin } from "@ranki/plugin-parser-constants-v2";
import { rankiBaseV2ParserPlugin } from "@ranki/plugin-parser-base-v2";
import { rankiParamsV2ParserPlugin } from "@ranki/plugin-parser-params-v2";
import { rankiFrameV2ParserPlugin } from "@ranki/plugin-parser-frame-v2";
import { rankiRichTextV2ParserPlugin } from "@ranki/plugin-parser-rich-text-v2";
import { rankiRichNumberV2ParserPlugin } from "@ranki/plugin-parser-rich-number-v2";
import { rankiRichStructureV2ParserPlugin } from "@ranki/plugin-parser-rich-structure-v2";
import { rankiFrameV1ParserPlugin } from "@ranki/plugin-parser-frame-v1";
import { rankiFrameV2ComponentsPluginDom } from "@ranki/plugin-component-frame-v2-dom";

export const pluginObjects = [
  rankiBaseV2ParserPlugin,
  rankiConstantsV2ParserPlugin,
  rankiParamsV2ParserPlugin,
  rankiFrameV2ParserPlugin,
  rankiRichTextV2ParserPlugin,
  rankiRichNumberV2ParserPlugin,
  rankiRichStructureV2ParserPlugin,
  rankiFrameV1ParserPlugin,
];

export const componentObjects = [rankiFrameV2ComponentsPluginDom];
