import type { RankiComponent } from "../../types/ranki-component.types.mjs";

export function createHorizontalScroller(attach: HTMLElement): RankiComponent {
  const container = document.createElement("ranki-horizontal-scroller");
  container.classList.add("container");
  attach.appendChild(container);

  const scroller = document.createElement("ranki-horizontal-scroller");
  scroller.classList.add("scroller");
  container.appendChild(scroller);

  return { element: scroller };
}
