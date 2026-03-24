import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
// import { AnkiUi } from "@ranki/package-anki-ui";
import { TAGS } from "../constants.mjs";
import css from "./payload.css?raw";
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
  copyContent,
} from "../../../../utils/code.mjs";

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: ({ ser, pref }) => {
    const noEmptyLines = ser.props.component.default.content.no_empty_lines;
    const { left, content, element, scroller } = createCodePayloadScaffolding();
    // const source = ser.source;
    // return prismPayload(Prism, source, "</>", true, "yaml", "");
    // const element = document.createElement("div");
    // const h = AnkiUi.horizontalScroller
    content.innerText = "(collecting info)";

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
        async () => {
          // element.innerText = "";
          // element.classList.add("code-block");
          // element.appendChild(h.element);
          // const pre = document.createElement("pre");
          // const code = document.createElement("code");
          // pre.appendChild(code);
          // h.getMount!().appendChild(pre);
          // const span = document.createElement("span");
          // code.appendChild(span);

          // const language = "yaml";
          const envInfo = await collectEnvironmentInfo();
          console.log("envInfo", envInfo);
          const obj = {
            pref,
            envInfo,
          };
          const source = yaml.stringify(obj);
          const raw = getProcessedSource(source, noEmptyLines);
          left.innerHTML = getLineNumbersHtml(raw);
          content.innerHTML = getHighlightedCodeHtml(Prism, "Yaml", raw, "</>");

          // const highlighted = Prism.highlight(
          //   source,
          //   Prism.languages[language],
          //   language,
          // );
          // span.innerHTML = highlighted;

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

// export const payload: R = {
//   chain: [...TAGS, "payload", "block"],
//   kind: "leaf",
//   sync: ({ pref }) => {
//     const element = document.createElement("div");
//     const h = AnkiUi.horizontalScroller();
//     element.innerText = "(collecting info)";

//     return {
//       element,
//       css: [
//         ...h.css!,
//         {
//           id: "prism-atom-dark",
//           css: prismCss,
//         },
//         {
//           id: "code-block-section",
//           css,
//         },
//       ],
//       afterMount: [
//         ...(h.afterMount || []),
//         async () => {
//           element.innerText = "";
//           element.classList.add("code-block");
//           element.appendChild(h.element);
//           const pre = document.createElement("pre");
//           const code = document.createElement("code");
//           pre.appendChild(code);
//           h.getMount!().appendChild(pre);
//           const span = document.createElement("span");
//           code.appendChild(span);

//           const language = "yaml";
//           const envInfo = await collectEnvironmentInfo();
//           const raw = {
//             pref,
//             envInfo,
//           };
//           const stringified = yaml.stringify(raw);

//           const highlighted = Prism.highlight(
//             stringified,
//             Prism.languages[language],
//             language,
//           );
//           span.innerHTML = highlighted;
//         },
//       ],
//       beforeUnmount: [...(h.beforeUnmount || [])],
//     };
//   },
// };
