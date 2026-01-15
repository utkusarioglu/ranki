import type { HudProps } from "../hud.types.mjs";

export function createCardFeature(props: HudProps, attach: HTMLElement) {
  const container = document.createElement("ranki-hud-item");
  container.classList.add("card");
  container.classList.add("outer-padding");
  container.classList.add("fill-1");
  container.classList.add("curved-1");
  const cardType = document.createElement("ranki-hud-item");
  cardType.classList.add("card-type");
  cardType.classList.add("half-padding");
  cardType.classList.add("fill-2");
  cardType.classList.add("curved-2");
  cardType.innerText = props.card.type;
  container.appendChild(cardType);
  const card = document.createElement("ranki-hud-item");
  card.classList.add("card");
  card.classList.add("fill-1");
  card.classList.add("half-padding");
  card.innerText = props.card.card;
  container.appendChild(card);
  const cardFace = document.createElement("ranki-hud-item");
  cardFace.classList.add("card-face");
  cardFace.classList.add("fill-1");
  cardFace.classList.add("half-padding");
  cardFace.innerText = props.card.face;
  container.appendChild(cardFace);
  attach.appendChild(container);
}
