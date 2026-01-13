import type { HudProps } from "../hud.types.mts";

export function createCardFeature(props: HudProps, attach: HTMLElement) {
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
  attach.appendChild(card);
}
