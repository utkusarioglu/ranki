import type { IDqmPlugin } from "@dqm/package-dqm-api-v2";
import { staticRenderer } from "./engines/static/plugin.mjs";
import { debugRenderer } from "./renderers/debug/debug.ren.mjs";

const pluginPackage: IDqmPlugin = [staticRenderer, debugRenderer];

export default pluginPackage;

export {
  createCodePayloadBlockScaffolding,
  createCodePayloadInlineScaffolding,
  getProcessedSource,
  getLineNumbersHtml,
  getHighlightedCodeHtml,
} from "./utils/export.mjs";
