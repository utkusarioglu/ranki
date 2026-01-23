import { assertNever } from "../../../error/assertions.mts";
import type { HudProps } from "../hud.types.mjs";

export function createAddressFeature(props: HudProps, attach: HTMLElement) {
  const address = document.createElement("ranki-hud-item");
  address.classList.add("outer-padding");
  address.classList.add("fill-1");
  address.classList.add("curved-1");
  address.classList.add("address");

  const addressParts: HTMLElement[] = [];
  props.address.segments.forEach((a) => {
    const e = document.createElement("ranki-hud-item");
    e.classList.add("address-part");
    e.innerText = a.shown.join("");

    switch (a.mode) {
      case "trim":
      case "hide":
      case "separator":
        e.classList.add("address-divider");
        e.classList.add("color-2");
        e.classList.add("inline-padding");
        break;
      case "show":
        e.classList.add("exposed");
        e.classList.add("curved-2");
        e.classList.add("fill-2");
        e.classList.add("half-padding");
        e.classList.add("half-padding");
        e.classList.add("color-2");
        break;
      default:
        assertNever({
          why: "Unrecognized address segment mode",
          details: { a },
        });
    }

    addressParts.push(e);
  });
  addressParts.forEach((p) => {
    address.appendChild(p);
  });
  attach.appendChild(address);
}
