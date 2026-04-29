import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { TAGS } from "../constants.mjs";
import Prism from "prismjs";
import yaml from "yaml";
import "prismjs/components/prism-yaml.js";
import prismCss from "./prism/prism-atom-dark.css?raw";
import { collectEnvironmentInfo } from "./collect.mjs";
import {
  createCodePayloadBlockScaffolding,
  getProcessedSource,
  getLineNumbersHtml,
  getHighlightedCodeHtml,
} from "../../../../utils/export.mjs";

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: ({ ser, pref }) => {
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
          const envInfo = await collectEnvironmentInfo();
          const obj = { pref, envInfo };
          const source = yaml.stringify(obj);
          const raw = getProcessedSource(source, noEmptyLines);
          const lineNums = getLineNumbersHtml(raw);
          left.innerHTML = lineNums;
          content.innerHTML = getHighlightedCodeHtml(Prism, "yaml", raw, "</>");
        },
      ],
      beforeUnmount: [...beforeUnmount],
    };
  },
};
