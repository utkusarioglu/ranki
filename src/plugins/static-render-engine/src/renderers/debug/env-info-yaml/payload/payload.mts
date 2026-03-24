import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { TAGS } from "../constants.mjs";
import Prism from "prismjs";
import yaml from "yaml";
import "prismjs/components/prism-yaml.js";
import prismCss from "./prism/prism-atom-dark.css?raw";
import { collectEnvironmentInfo } from "./collect.mjs";
import {
  createCodePayloadScaffolding,
  getProcessedSource,
  getLineNumbersHtml,
  getHighlightedCodeHtml,
} from "../../../../utils/export.mjs";

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: ({ ser, pref }) => {
    const noEmptyLines = ser.props.component.default.content.no_empty_lines;
    const { left, content, element, afterMount, beforeUnmount, css } =
      createCodePayloadScaffolding(prismCss);
    content.innerText = "(collecting info)";

    return {
      element,
      css,
      afterMount: [
        ...afterMount,
        async () => {
          const envInfo = await collectEnvironmentInfo();
          const obj = {
            pref,
            envInfo,
          };
          const source = yaml.stringify(obj);
          const raw = getProcessedSource(source, noEmptyLines);
          const lineNums = getLineNumbersHtml(raw);
          console.log("raw", raw.split("\n").length, "\n", raw, "\n", lineNums);
          left.innerHTML = lineNums;
          content.innerHTML = getHighlightedCodeHtml(Prism, "yaml", raw, "</>");
        },
      ],
      beforeUnmount: [...beforeUnmount],
    };
  },
};
