import { createHorizontalScroller } from "../../horizontal-scroller/horizontal-scroller.mts";
import type { HudProps } from "../main.mjs";

export function createHudContainer(props: HudProps) {
  const container = document.createElement("ranki-hud-container");
  container.classList.add("container");
  container.classList.add(`error-level-${props.parser.errorLevel}`);
  const center = document.createElement("ranki-hud-container");
  center.classList.add("center");
  container.append(center);

  const scroller = createHorizontalScroller(center);
  return { container, scroller };
}
