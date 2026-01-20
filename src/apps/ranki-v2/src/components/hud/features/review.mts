import type { HudProps } from "../hud.types.mjs";

export function createReviewFeature(props: HudProps, attach: HTMLElement) {
  // if (props.review.marked || props.review.flag.color !== "none") {
  const elems: HTMLElement[] = [];

  if (props.review.marked && props.review.marked.message) {
    const marked = document.createElement("ranki-hud-item");
    marked.classList.add("half-padding");
    marked.innerText = props.review.marked.message;
    elems.push(marked);
    // review.appendChild(marked);
  }

  if (props.review.flag.color !== "none" && props.review.flag.message) {
    const flag = document.createElement("ranki-hud-item");
    flag.classList.add(
      "half-padding",
      "curved-2",
      "fill-2",
      "flex",
      `flag-type-${props.review.flag.color}`,
    );
    flag.innerText = props.review.flag.message;
    elems.push(flag);
    // review.appendChild(flag);
  }

  if (!elems.length) {
    return;
  }

  const review = document.createElement("ranki-hud-item");
  review.classList.add("outer-padding", "fill-1", "curved-1", "flex");
  elems.forEach((e) => review.appendChild(e));
  attach.appendChild(review);
  // }
}
