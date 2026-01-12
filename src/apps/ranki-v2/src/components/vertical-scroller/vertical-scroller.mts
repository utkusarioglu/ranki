import v from "./vertical-scroller.css?raw";

export function createVerticalScroller(attach: HTMLElement) {
  const style = document.createElement("style");
  style.className = "vertical-scroller";
  style.innerHTML = v;
  attach.appendChild(style);

  const container = document.createElement("ranki-vertical-scroller");
  container.classList.add("container");
  attach.appendChild(container);

  const scroller = document.createElement("ranki-vertical-scroller");
  scroller.classList.add("scroller");
  container.appendChild(scroller);

  return scroller;
}
