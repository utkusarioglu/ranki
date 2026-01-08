import type { IDqmRenderPluginRenderer } from "@dqm/package-dqm-api-v2";
import { randomColor } from "../randomColor.mjs";
import style from "./container.css?raw";
import html from "./container.html?raw";

function getElement<Elem extends HTMLElement = HTMLDivElement>(html: string) {
  const container = document.createElement("div");
  container.innerHTML = html;
  const element = container.firstChild as Elem;
  return element;
}

export const debugPayloadBlock: IDqmRenderPluginRenderer = {
  // load: "lazy",
  chain: ["debug", "payload", "block"],
  kind: "leaf",
  sync: ({ trn, pref }) => {
    const element = getElement(html);
    element.style.borderColor = randomColor(pref.scheme);
    element.innerText = "(" + trn.source + ")";
    return {
      element,
      afterMount: [
        async () => {
          const speed = 0.5;
          const angle = 360;
          let step = 0;
          const animation = () => {
            step += 1 * speed;
            element.style.rotate = step + "deg";
            if (step < angle) {
              window.requestAnimationFrame(animation);
            }
          };
          window.requestAnimationFrame(animation);
        },
      ],
      beforeUnmount: [
        async () => {
          console.log("unmount");
        },
      ],
      css: [
        {
          id: "debug-payload-block",
          css: style,
        },
      ],
    };
  },
  deferred: async () => {
    await new Promise<void>((r) => setTimeout(r, 5000));

    return ({ trn, pref }) => {
      const element = getElement(html);
      element.style.borderColor = randomColor(pref.scheme);
      element.innerText = trn.source;
      return {
        element,
        afterMount: [
          async () => {
            const speed = 5;
            const angle = 360 * 3;
            let step = 0;
            const animation = () => {
              step += 1 * speed;
              element.style.rotate = step + "deg";
              if (step < angle) {
                window.requestAnimationFrame(animation);
              }
            };
            window.requestAnimationFrame(animation);
          },
        ],
        beforeUnmount: [
          async () => {
            console.log("unmount");
          },
        ],
        css: [
          {
            id: "debug-payload-block",
            css: style,
          },
        ],
      };
    };
  },
};
