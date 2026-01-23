import styles from "./horizontal.component.css?inline";

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

export function horizontalScrollUtil() {
  const head = document.createElement("ranki-horizontal-scroller");
  head.classList.add("scroll-container");

  const tail = document.createElement("ranki-horizontal-scroller");
  tail.classList.add("scroll-scroller");
  head.appendChild(tail);

  return { head, tail, sheet };
}
