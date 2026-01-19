import type { IDqmRenderPluginRenderer as R } from "@dqm/package-dqm-api-v2";
import { TAGS } from "../constants.mjs";
import css from "./payload.css?raw";

export const payload: R = {
  chain: [...TAGS, "payload", "block"],
  kind: "leaf",
  sync: () => {
    const element = document.createElement("div");
    element.className = "palette";
    const hues = document.createElement("div");
    [
      "red",
      "orange",
      "yellow",
      "green",
      "turquoise",
      "blue",
      "purple",
      "magenta",
    ].map((v) => {
      const hue = document.createElement("div");
      hue.classList = "row";
      Array(6)
        .fill(null)
        .map((_, i) => {
          const col = document.createElement("div");
          col.style.backgroundColor = `var(--palette-${v}-${i}-hex)`;
          col.innerText = i.toString();
          hue.appendChild(col);
        });
      hues.appendChild(hue);
    });

    const tones = document.createElement("div");
    tones.className = "row";
    ["dark", "0", "1", "2", "3", "4", "5", "bright"].forEach((n) => {
      const col = document.createElement("div");
      col.style.backgroundColor = `var(--palette-tone-${n}-hex)`;
      col.innerText = n;
      tones.appendChild(col);
    });

    // hues.className = "hues";
    element.appendChild(hues);
    element.appendChild(tones);

    return {
      element,
      css: [
        // ...h.css!
        {
          id: "color-palette",
          css,
        },
      ],
      afterMount: [
        // ...(h.afterMount || []),
        // async () => {
        //   element.innerText = "";
        //   element.classList.add("code-block");
        //   element.appendChild(h.element);
        //   const pre = document.createElement("pre");
        //   const code = document.createElement("code");
        //   pre.appendChild(code);
        //   h.getMount!().appendChild(pre);
        //   const span = document.createElement("span");
        //   code.appendChild(span);
        //   const left = h.subtree!.left();
        //   const language = "markup";
        //   const clone = document.documentElement.cloneNode(true) as HTMLElement;
        //   const excluded: string[] = []; // TODO find a sensible way of getting the selector for the document root to here through preferences
        //   if (excluded.length) {
        //     excluded.forEach((e) => {
        //       const el = clone.querySelector(e);
        //       el?.remove();
        //     });
        //   }
        //   const outerHtml = clone.outerHTML;
        //   left.innerHTML = Array(outerHtml.split("\n").length)
        //     .fill(null)
        //     .map((_, i) => (i + 1).toString().padStart(4))
        //     .join("<br>");
        //   const highlighted = Prism.highlight(
        //     outerHtml,
        //     Prism.languages[language],
        //     language,
        //   );
        //   span.innerHTML = highlighted;
        // },
      ],
      // beforeUnmount: [
      //   ...(h.beforeUnmount || []),
      // async () => {
      //   element.addEventListener("click", async () => {
      //     try {
      //       await navigator.clipboard.writeText(code.innerText);
      //       console.log("Copied to clipboard:", code.innerText);
      //     } catch (err) {
      //       console.log("Copy failed", navigator.clipboard);
      //     }
      //   });
      // },
      // ],
    };
  },
};
