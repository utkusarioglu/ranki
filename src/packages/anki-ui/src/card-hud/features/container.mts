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

function createHorizontalScroller(attach: HTMLElement) {
  const container = document.createElement("ranki-horizontal-scroller");
  container.classList.add("container");
  attach.appendChild(container);

  const scroller = document.createElement("ranki-horizontal-scroller");
  scroller.classList.add("scroller");
  container.appendChild(scroller);

  return scroller;
}
