import { assertNever } from "../../../../error/assertions.mts";
import type { HudAddressProps } from "../../hud.types.mts";
import styles from "./address.component.css?inline";

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class HudAddress extends HTMLElement {
  private p!: HudAddressProps;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [sheet];
  }

  set props(props: HudAddressProps) {
    this.p = props;
    this.render();
  }

  private build() {
    const container = document.createElement("div");
    container.classList.add("container");

    this.p.segments.forEach((s) => {
      const seg = document.createElement("div");
      switch (s.mode) {
        case "trim":
        case "hide":
        case "separator":
          seg.classList.add("divider");
          break;
        case "show":
          seg.classList.add("segment");
          break;
        default:
          assertNever({
            why: "Unrecognized address segment mode",
            details: { segments: this.p.segments, segment: s },
          });
      }
      seg.innerText = s.shown.join("");
      container.appendChild(seg);
    });
    return container;
  }

  render() {
    this.shadowRoot!.replaceChildren(this.build());
  }
}

customElements.define("ranki-hud-address", HudAddress);

export function getOrCreateAddress(
  props: HudAddressProps,
  attach: HTMLElement,
) {
  let el: HudAddress | null = document.body.querySelector("ranki-hud-address");

  if (!el) {
    console.log("creating");
    el = document.createElement("ranki-hud-address") as HudAddress;
    el.props = props;
    attach.appendChild(el);
  }

  return el;
}
