import type { HudProps } from "../hud.types.mjs";

export function createReviewFeature(props: HudProps, attach: HTMLElement) {
  if (props.review.marked || props.review.flag.type !== "flag0") {
    const review = document.createElement("ranki-hud-item");
    review.classList.add("outer-padding", "fill-1", "curved-1", "flex");

    if (props.review.marked) {
      const marked = document.createElement("ranki-hud-item");
      marked.classList.add("half-padding");
      marked.innerText = props.review.marked.message;
      review.appendChild(marked);
    }

    if (props.review.flag.type !== "flag0") {
      const flag = document.createElement("ranki-hud-item");
      flag.classList.add(
        "half-padding",
        "curved-2",
        "fill-2",
        "flex",
        `flag-type-${props.review.flag.type}`,
      );
      flag.innerText = props.review.flag.message;
      review.appendChild(flag);
    }

    attach.appendChild(review);
  }
}
