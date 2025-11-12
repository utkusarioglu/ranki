import type { RankiRenderNode } from "@ranki/package-render-v2";
import html from "./main.html?raw";
import css from "./main.css?raw";

export function horizontalScroller(): RankiRenderNode {
  const container = document.createElement("div");
  container.innerHTML = html;
  const element = container.querySelector<HTMLElement>(".container")!;
  const left = container.querySelector<HTMLElement>(".left")!;
  const right = container.querySelector<HTMLElement>(".right")!;
  const content = container.querySelector<HTMLElement>(".content")!;

  return {
    element,
    slots: {
      left,
      right,
      content,
    },
    css: [
      {
        id: "horizontal-scroll",
        css,
      },
    ],
  };
}
