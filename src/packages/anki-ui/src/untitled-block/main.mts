import {
  type RankiRenderNode,
  type RenderClientOptions,
} from "@ranki/package-render-v2";
import css from "./main.css?raw";

export function untitledBlock(options: RenderClientOptions): RankiRenderNode {
  const element = document.createElement("untitled-block");
  element.classList.add(options.scheme);
  element.classList.add("container");
  const children = document.createElement("untitled-block");
  children.classList.add("children");
  element.appendChild(children);
  return {
    element,
    slots: {
      children,
    },
    css: [
      {
        id: "untitled-block",
        css,
      },
    ],
  };
}
