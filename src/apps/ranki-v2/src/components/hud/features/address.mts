import { ANKI_DECK_SEPARATOR } from "../../../config/config.constants.mts";
import type { HudProps } from "../hud.types.mjs";

export function createAddressFeature(props: HudProps, attach: HTMLElement) {
  const address = document.createElement("ranki-hud-item");
  address.classList.add("outer-padding");
  address.classList.add("fill-1");
  address.classList.add("curved-1");
  address.classList.add("address");
  if (props.address.prefix.length) {
    const prefix = document.createElement("ranki-hud-item");
    prefix.classList.add("half-padding");
    prefix.classList.add("smaller");
    prefix.classList.add("color-2");
    prefix.innerText = "●";
    address.appendChild(prefix);
  }

  const exposed = document.createElement("ranki-hud-item");
  address.appendChild(exposed);
  exposed.classList.add("exposed");
  exposed.classList.add("curved-2");
  exposed.classList.add("fill-2");
  exposed.classList.add("half-padding");

  const addressParts: HTMLElement[] = [];
  props.address.exposed.forEach((a) => {
    const e = document.createElement("ranki-hud-item");
    e.classList.add("address-part");
    e.innerText = a;
    addressParts.push(e);
    const sp = document.createElement("ranki-hud-item");
    sp.classList.add("address-divider");
    sp.classList.add("color-2");
    sp.classList.add("inline-padding");
    sp.innerText = ANKI_DECK_SEPARATOR;
    addressParts.push(sp);
  });
  addressParts.slice(0, -1).forEach((p) => {
    exposed.appendChild(p);
  });
  attach.appendChild(address);
  if (props.address.suffix.length) {
    const suffix = document.createElement("ranki-hud-item");
    suffix.classList.add("half-padding");
    suffix.classList.add("smaller");
    suffix.classList.add("color-2");
    suffix.innerText = "○";
    address.appendChild(suffix);
  }
}
