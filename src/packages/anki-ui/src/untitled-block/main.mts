import css from "./main.css?raw";
import type {
  RenderNode,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-api-v2";

export function untitledBlock(pref: IDqmRendererClientPreferences): RenderNode {
  const element = document.createElement("untitled-block");
  element.classList.add(pref.scheme);
  element.classList.add("container");
  const children = document.createElement("untitled-block");
  children.classList.add("children");
  element.appendChild(children);
  return {
    element,
    getMount: () => children,
    css: [
      {
        id: "untitled-block",
        css,
      },
    ],
  };
}
