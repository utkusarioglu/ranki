import type { RankiRenderNode } from "../../../types/render-node.mts";
import { createHorizontalScroller } from "../../horizontal-scroller/horizontal-scroller.mts";
import type { HudProps } from "../main.mjs";

export function createHudContainer(
  props: HudProps,
): RankiRenderNode<HTMLElement> {
  const container = document.createElement("ranki-hud-container");
  container.classList.add("container");
  container.classList.add(`error-level-${props.parser.errorLevel}`);
  const center = document.createElement("ranki-hud-container");
  center.classList.add("center");
  container.append(center);
  const scroller = createHorizontalScroller(center);
  center.appendChild(scroller.element);

  return {
    element: container,
    refs: {
      scroller: scroller.element,
    },
    css: scroller.css,
  };
  // return { container, scroller };
}
