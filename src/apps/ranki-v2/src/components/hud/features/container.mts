import type { RankiComponent } from "../../../types/ranki-component.types.mjs";
import { createHorizontalScroller } from "../../horizontal-scroller/horizontal-scroller.mjs";
import type { HudProps } from "../hud.types.mjs";

export function createHudContainer(
  props: HudProps,
): RankiComponent<HTMLElement> {
  const container = document.createElement("ranki-hud-container");
  container.classList.add("container");
  container.classList.add(`error-level-${props.parser.errorLevel}`);
  const center = document.createElement("ranki-hud-container");
  center.classList.add("center");
  container.append(center);
  const scroller = createHorizontalScroller(center);
  center.appendChild(scroller.refs!["container"]);

  return {
    element: container,
    refs: {
      scroller: scroller.element,
    },
    // css: scroller.css,
  };
  // return { container, scroller };
}
