import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { NO_LANGUAGE, TAGS } from "../constants.mjs";
import Prism from "./prism/prism.mjs";
import prismCss from "./prism/prism-atom-dark.css?raw";
import {
  createCodePayloadScaffolding,
  getProcessedSource,
  getLineNumbersHtml,
  getHighlightedCodeHtml,
} from "@dqm/plugin-static-render-engine";

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: ({ ser }) => {
    const noEmptyLines = ser.props.component.default.content.no_empty_lines;
    const rawName = ser.props.component.default.language.name;
    const source = ser.source;

    const { left, content, element, css, afterMount, beforeUnmount } =
      createCodePayloadScaffolding(prismCss);
    const raw = getProcessedSource(source, noEmptyLines);
    left.innerHTML = getLineNumbersHtml(raw);
    content.innerHTML = getHighlightedCodeHtml(
      Prism,
      rawName,
      raw,
      NO_LANGUAGE,
    );

    return {
      element,
      css,
      afterMount: [...afterMount],
      beforeUnmount: [...beforeUnmount],
    };
  },
};
