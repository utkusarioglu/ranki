export function createHorizontalScroller(attach: HTMLElement) {
  const container = document.createElement("ranki-horizontal-scroller");
  container.classList.add("container");
  attach.appendChild(container);

  const scroller = document.createElement("ranki-horizontal-scroller");
  scroller.classList.add("scroller");
  container.appendChild(scroller);

  return scroller;
}
