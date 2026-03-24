import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { NO_LANGUAGE, TAGS } from "../constants.mjs";
import css from "./payload.css?raw";
import Prism from "./prism/prism.mjs";
import prismCss from "./prism/prism-atom-dark.css?raw";
import {
  createCodePayloadScaffolding,
  getProcessedSource,
  getLineNumbersHtml,
  getHighlightedCodeHtml,
  copyContent,
} from "./code.mjs";

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: ({ ser }) => {
    const noEmptyLines = ser.props.component.default.content.no_empty_lines;
    const rawName = ser.props.component.default.language.name;
    const source = ser.source;

    const { left, content, element, scroller } = createCodePayloadScaffolding();
    const raw = getProcessedSource(source, noEmptyLines);
    left.innerHTML = getLineNumbersHtml(raw);
    content.innerHTML = getHighlightedCodeHtml(
      Prism,
      rawName,
      raw,
      NO_LANGUAGE,
    );

    const onClick = () => copyContent(content);

    return {
      element,
      css: [
        ...scroller.css!,
        {
          id: "prism-atom-dark",
          css: prismCss,
        },
        {
          id: "code-block-section",
          css,
        },
      ],
      afterMount: [
        ...(scroller.afterMount || []),
        () => {
          element.addEventListener("click", onClick);
        },
      ],
      beforeUnmount: [
        ...(scroller.beforeUnmount || []),
        () => {
          element.removeEventListener("click", onClick);
        },
      ],
    };
  },
};
