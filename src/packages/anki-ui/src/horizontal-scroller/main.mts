import html from "./main.html?raw";
import css from "./main.css?raw";
import type { RenderNode } from "@dqm/package-dqm-api-v2";

export function horizontalScroller(): RenderNode {
  const container = document.createElement("div");
  container.innerHTML = html;
  const element = container.querySelector<HTMLElement>(".container")!;
  const left = container.querySelector<HTMLElement>(".left")!;
  const right = container.querySelector<HTMLElement>(".right")!;
  const children = container.querySelector<HTMLElement>(".content")!;

  return {
    element,
    getMount: () => children,
    subtree: {
      left: () => {
        left.style.display = "block";
        children.classList.add("has-left");
        return left;
      },
      right: () => {
        right.style.display = "block";
        children.classList.add("has-right");
        return right;
      },
    },
    css: [
      {
        id: "horizontal-scroll",
        css,
      },
    ],
    // afterMount: [],
    // beforeUnmount: [],
  };
}
