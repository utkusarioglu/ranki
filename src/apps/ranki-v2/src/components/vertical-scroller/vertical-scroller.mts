import type { RankiComponent } from "../../types/ranki-component.types.mjs";
import "./vertical-scroller.css";

export function createVerticalScroller(attach: HTMLElement): RankiComponent {
  // const style = document.createElement("style");
  // style.className = "vertical-scroller";
  // style.innerHTML = v;
  // attach.appendChild(style);

  const container = document.createElement("ranki-vertical-scroller");
  container.classList.add("container");
  attach.appendChild(container);

  const element = document.createElement("ranki-vertical-scroller");
  element.classList.add("scroller");
  container.appendChild(element);

  return {
    element,
    // css: [
    //   {
    //     id: "vertical-scroller",
    //     css: v,
    //   },
    // ],
  };
}
