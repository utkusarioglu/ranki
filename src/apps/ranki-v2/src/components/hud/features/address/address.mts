import { assertNever } from "../../../../error/assertions.mts";
import type { HudAddressProps } from "../../hud.types.mts";
import styles from "./address.component.css?inline";

const NAME = "ranki-hud-address";
type Props = HudAddressProps;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class HudAddress extends HTMLElement {
  private p!: Props;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [sheet];
  }

  set props(props: Props) {
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

customElements.define(NAME, HudAddress);

export function hudAddress(props: Props, attach: HTMLElement) {
  let el: HudAddress | null = document.body.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as HudAddress;
    attach.appendChild(el);
    el.props = props;
  }

  return el;
}
