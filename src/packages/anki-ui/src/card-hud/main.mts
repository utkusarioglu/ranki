import type { RenderNode } from "@dqm/package-dqm-api-v2";
import css from "./main.css?raw";

interface HudProps {
  hasReplacements: boolean;
  parseMode: "v1" | "v2" | "ignored";

  errorLevel: "none" | "warning" | "error";
  address: {
    prefix: string[];
    exposed: string[];
    suffix: string[];
  };
  tags: string[];
  marked: boolean;
  flag: {
    type: number;
    message: string;
  };
  card: {
    type: string;
    face: string;
  };
}

export function cardHud(props: HudProps): RenderNode {
  const element = document.createElement("anki-hud");
  element.classList.add("container");
  element.classList.add(`error-level-${props.errorLevel}`);

  const scroller = document.createElement("anki-hud");
  scroller.classList.add("scroller");
  element.appendChild(scroller);

  const parser = document.createElement("anki-hud");
  parser.classList.add("parser");
  parser.classList.add("outer-padding");
  parser.classList.add("curved-1");
  parser.classList.add("fill-1");
  const version = document.createElement("anki-hud");
  version.classList.add("version");
  version.classList.add("fill-2");
  version.classList.add("curved-2");
  version.classList.add("half-padding");
  version.innerText = props.parseMode;
  parser.appendChild(version);
  scroller.appendChild(parser);
  if (props.hasReplacements) {
    const replacements = document.createElement("anki-hud");
    replacements.classList.add("has-replacements");
    replacements.classList.add("half-padding");
    replacements.classList.add("smaller");
    replacements.innerText = "{Δ}";
    parser.appendChild(replacements);
  }

  if (props.marked || props.flag.type !== 0) {
    const review = document.createElement("anki-hud");
    review.classList.add("outer-padding", "fill-1", "curved-1", "flex");

    if (props.marked) {
      const marked = document.createElement("anki-hud");
      marked.classList.add("half-padding");
      marked.innerText = "Study";
      review.appendChild(marked);
    }

    if (props.flag.type !== 0) {
      const flag = document.createElement("anki-hud");
      flag.classList.add(
        "half-padding",
        "curved-2",
        "fill-2",
        "flex",
        `flag-type-${props.flag.type}`,
      );
      flag.innerText = props.flag.message;
      review.appendChild(flag);
    }

    scroller.appendChild(review);
  }

  const address = document.createElement("anki-hud");
  address.classList.add("outer-padding");
  address.classList.add("fill-1");
  address.classList.add("curved-1");
  address.classList.add("address");
  if (props.address.prefix.length) {
    const prefix = document.createElement("anki-hud");
    prefix.classList.add("half-padding");
    prefix.classList.add("smaller");
    prefix.classList.add("color-2");
    prefix.innerText = "●";
    address.appendChild(prefix);
  }

  const exposed = document.createElement("anki-hud");
  address.appendChild(exposed);
  exposed.classList.add("exposed");
  exposed.classList.add("curved-2");
  exposed.classList.add("fill-2");
  exposed.classList.add("half-padding");

  const addressParts: HTMLElement[] = [];
  props.address.exposed.forEach((a) => {
    const e = document.createElement("anki-hud");
    e.classList.add("address-part");
    e.innerText = a;
    addressParts.push(e);
    const sp = document.createElement("anki-hud");
    sp.classList.add("address-divider");
    sp.classList.add("color-2");
    sp.classList.add("inline-padding");
    sp.innerText = "::";
    addressParts.push(sp);
  });
  addressParts.slice(0, -1).forEach((p) => {
    exposed.appendChild(p);
  });
  scroller.appendChild(address);
  if (props.address.suffix.length) {
    const suffix = document.createElement("anki-hud");
    suffix.classList.add("half-padding");
    suffix.classList.add("smaller");
    suffix.classList.add("color-2");
    suffix.innerText = "○";
    address.appendChild(suffix);
  }

  const card = document.createElement("anki-hud");
  card.classList.add("card");
  card.classList.add("outer-padding");
  card.classList.add("fill-1");
  card.classList.add("curved-1");
  const cardType = document.createElement("anki-hud");
  cardType.classList.add("card-type");
  cardType.classList.add("half-padding");
  cardType.classList.add("fill-2");
  cardType.classList.add("curved-2");
  cardType.innerText = props.card.type;
  card.appendChild(cardType);
  const cardFace = document.createElement("anki-hud");
  cardFace.classList.add("card-face");
  cardFace.classList.add("fill-1");
  cardFace.classList.add("half-padding");
  cardFace.innerText = props.card.face;
  card.appendChild(cardFace);
  scroller.appendChild(card);

  if (props.tags.length) {
    const tags = document.createElement("anki-hud");
    tags.classList.add("curved-1");
    tags.classList.add("fill-1");
    tags.classList.add("outer-padding");
    tags.classList.add("tags");
    props.tags.forEach((tag) => {
      const t = document.createElement("anki-hud");
      t.classList.add("tag");
      t.classList.add("curved-2");
      t.classList.add("half-padding");
      t.classList.add("fill-2");
      t.innerText = tag;
      tags.appendChild(t);
    });
    scroller.appendChild(tags);
  }

  return {
    element,
    css: [
      {
        id: "anki-hud",
        css,
      },
    ],
    afterMount: [],
    beforeUnmount: [],
  };
}
