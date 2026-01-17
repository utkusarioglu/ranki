import type { HudProps } from "../hud.types.mjs";

export function createTagsFeature(props: HudProps, attach: HTMLElement) {
  if (props.tags.count > 1) {
    const tags = document.createElement("ranki-hud-item");
    tags.classList.add("curved-1");
    tags.classList.add("fill-1");
    tags.classList.add("outer-padding");
    tags.classList.add("tags");
    props.tags.neutral.forEach((tag) => {
      const t = document.createElement("ranki-hud-item");
      t.classList.add("tag");
      t.classList.add("curved-2");
      t.classList.add("half-padding");
      t.classList.add("fill-2");
      t.classList.add("neutral");
      t.innerText = tag;
      tags.appendChild(t);
    });
    props.tags.ranki.forEach((tag) => {
      const t = document.createElement("ranki-hud-item");
      t.classList.add("tag");
      t.classList.add("curved-2");
      t.classList.add("half-padding");
      t.classList.add("fill-2");
      t.classList.add("ranki");
      t.innerText = tag;
      tags.appendChild(t);
    });
    attach.appendChild(tags);
  }
}
