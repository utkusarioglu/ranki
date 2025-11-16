import type { RankiRenderHelper } from "@ranki/package-render-v2";
import html from "./main.html?raw";
import css from "./main.css?raw";

export function horizontalScroller(): RankiRenderHelper {
  const container = document.createElement("div");
  container.innerHTML = html;
  const element = container.querySelector<HTMLElement>(".container")!;
  const left = container.querySelector<HTMLElement>(".left")!;
  const right = container.querySelector<HTMLElement>(".right")!;
  const children = container.querySelector<HTMLElement>(".content")!;

  return {
    element,
    slots: {
      children,
    },
    subtree: {
      left: () => {
        left.style.display = "block";
        return left;
      },
      right: () => {
        right.style.display = "block";
        return right;
      },
    },
    css: [
      {
        id: "horizontal-scroll",
        css,
      },
    ],
    afterMount: [],
    beforeUnmount: [],
  };
}
