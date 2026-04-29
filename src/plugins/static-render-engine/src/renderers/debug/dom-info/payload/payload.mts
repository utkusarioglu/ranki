import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { TAGS } from "../constants.mjs";
import Prism from "prismjs";
import "prismjs/components/prism-markup.js";
import prismCss from "./prism/prism-atom-dark.css?raw";
import {
  createCodePayloadBlockScaffolding,
  getProcessedSource,
  getLineNumbersHtml,
  getHighlightedCodeHtml,
} from "../../../../utils/export.mjs";

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: ({ ser }) => {
    const fontSize = ser.props.component.default.font.size;
    const lineHeight = ser.props.component.default.font.line_height;
    const noEmptyLines = ser.props.component.default.content.no_empty_lines;
    const { left, content, element, afterMount, beforeUnmount, css } =
      createCodePayloadBlockScaffolding(prismCss, fontSize, lineHeight);
    content.innerText = "(collecting info)";

    return {
      element,
      css,
      afterMount: [
        ...afterMount,
        async () => {
          const clone = document.documentElement.cloneNode(true) as HTMLElement;
          const excluded: string[] = []; // TODO find a sensible way of getting the selector for the document root to here through preferences
          if (excluded.length) {
            excluded.forEach((e) => {
              const el = clone.querySelector(e);
              el?.remove();
            });
          }

          const outerHtml = clone.outerHTML;

          const raw = getProcessedSource(outerHtml, noEmptyLines);
          const lineNums = getLineNumbersHtml(raw);
          left.innerHTML = lineNums;

          const f = getHighlightedCodeHtml(Prism, "markup", raw, "</>");
          content.innerHTML = f;
        },
      ],
      beforeUnmount: [...beforeUnmount],
    };
  },
};
