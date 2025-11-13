import { rankiConstantsV2ParserPlugin } from "@ranki/plugin-grammar-constants-v2";
import { rankiBaseV2ParserPlugin } from "@ranki/plugin-parser-base-v2";
import { rankiParamsV2ParserPlugin } from "@ranki/plugin-grammar-params-v2";
import { rankiFrameV2ParserPlugin } from "@ranki/plugin-parser-frame-v2";
import { rankiRichTextV2ParserPlugin } from "@ranki/plugin-grammar-rich-text-v2";
import { rankiRichNumberV2ParserPlugin } from "@ranki/plugin-grammar-rich-number-v2";
import { rankiRichStructureV2ParserPlugin } from "@ranki/plugin-grammar-rich-structure-v2";
import { rankiFrameV1ParserPlugin } from "@ranki/plugin-parser-frame-v1";
import { rankiFrameV2ComponentsPluginCode } from "@ranki/plugin-component-frame-v2-code";
import { rankiBaseV2ComponentsPluginDefault } from "@ranki/plugin-component-base-v2-default";
import { rankiFrameV2ComponentsPluginLatex } from "@ranki/plugin-component-frame-v2-latex";
import { rankiFrameV2ComponentsPlugin } from "@ranki/plugin-component-frame-v2";
import { rankiFrameV2ComponentsPluginMermaid } from "@ranki/plugin-component-frame-v2-mermaid";
import { rankiFrameV2ComponentsPluginAudio } from "@ranki/plugin-component-frame-v2-audio";
import { renderPluginBaseV2Render } from "@ranki/plugin-render-base-v2";
import { renderPluginFrameV2Latex } from "@ranki/plugin-render-frame-v2-latex";
import { renderPluginFrameV2Code } from "@ranki/plugin-render-frame-v2-code";
import { renderPluginFrameV2Mermaid } from "@ranki/plugin-render-frame-v2-mermaid";
import { renderPluginFrameV2Audio } from "@ranki/plugin-render-frame-v2-audio";
import { renderPluginFrameV2Music } from "@ranki/plugin-render-frame-v2-music";
import { Render } from "@ranki/package-render-v2";

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

export const componentObjects = [
  rankiBaseV2ComponentsPluginDefault,
  rankiFrameV2ComponentsPlugin,
  rankiFrameV2ComponentsPluginCode,
  rankiFrameV2ComponentsPluginLatex,
  rankiFrameV2ComponentsPluginMermaid,
  rankiFrameV2ComponentsPluginAudio,
];

[
  renderPluginBaseV2Render,
  renderPluginFrameV2Latex,
  renderPluginFrameV2Code,
  renderPluginFrameV2Mermaid,
  renderPluginFrameV2Audio,
  renderPluginFrameV2Music,
].forEach((p) => Render.addPlugin(p));
