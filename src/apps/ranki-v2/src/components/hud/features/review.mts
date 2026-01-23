import type { HudProps } from "../hud.types.mjs";

export function createCuesFeature(props: HudProps, attach: HTMLElement) {
  if (!props.cues.length) return;
  const elems: HTMLElement[] = [];

  props.cues.forEach((c) => {
    if (!c.message) return;
    const flag = document.createElement("ranki-hud-item");
    flag.classList.add(
      "half-padding",
      "curved-2",
      "fill-2",
      "flex",
      `issuer-${c.issuer}`,
      `kind-${c.kind}`,
    );
    flag.innerText = c.message;
    elems.push(flag);
  });

  if (!elems.length) {
    return;
  }

  const review = document.createElement("ranki-hud-item");
  review.classList.add("outer-padding", "fill-1", "curved-1", "flex", "gapped");
  elems.forEach((e) => review.appendChild(e));
  attach.appendChild(review);
}
