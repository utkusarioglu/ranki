import { assertNever } from "../../../../error/assertions.mts";
import type { HudAddressProps, HudAddressSegment } from "../../hud.types.mts";
import styles from "./address.component.css?inline";

const NAME = "ranki-hud-address";
type Props = HudAddressProps;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class HudAddressCrumb extends HTMLElement {
  connectedCallback() {
    // behavior setup
  }
  exit() {
    this.classList.add("exiting");
    this.addEventListener("transitionend", () => this.remove(), { once: true });
  }
}

customElements.define("hud-address-crumb", HudAddressCrumb);

class HudAddress extends HTMLElement {
  private curr!: Props;
  private crumbs: HTMLDivElement[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [sheet];
  }

  set props(props: Props) {
    this.curr = props;
    this.render();
  }

  connectedCallback() {
    console.log("connected address", this);
  }

  private container() {
    let c = this.shadowRoot!.querySelector("div.container");
    if (c) {
      console.log("address reuse");
      return c;
    }
    c = document.createElement("div");
    c.classList.add("container");

    this.shadowRoot!.appendChild(c);
    return c;
  }

  private build() {
    const container = this.container();
    const cn = container.childNodes.length;
    const sn = this.curr.segments.length;
    const rm = [];

    for (let i = 0; i < Math.max(cn, sn); i++) {
      const s = this.curr.segments[i];
      if (s) {
        const e = this.shadowRoot!.querySelector(
          `[data-index="${i}"]`,
        ) as HTMLDivElement;
        if (!e) {
          this.createCrumb(s, i, container);
        } else {
          this.mutateCrumb(s, e);
        }
      } else {
        rm.push(container.childNodes[i]);
      }
    }
    rm.forEach((r) => {
      container.removeChild(r);
    });

    // this.curr.segments.forEach((s, i) => {
    //   const e = this.shadowRoot!.querySelector(
    //     `[data-index="${i}"]`,
    //   ) as HTMLDivElement;
    //   if (!e) {
    //     this.createCrumb(s, i, container);
    //   } else {
    //     this.mutateCrumb(s, e);
    //   }
    // });
    container.childNodes;
    return container;
  }

  private mutateCrumb(s: HudAddressSegment, e: HTMLDivElement) {
    switch (s.mode) {
      case "trim":
      case "hide":
      case "separator":
        e.className = "divider";
        break;
      case "show":
        e.className = "segment";
        break;
      default:
        assertNever({
          why: "Unrecognized address segment mode",
          details: { segments: this.curr.segments, segment: s },
        });
    }
    e.innerText = s.shown.join("");
  }

  private createCrumb(s: HudAddressSegment, i: number, container: Element) {
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
          details: { segments: this.curr.segments, segment: s },
        });
    }
    seg.setAttribute("data-index", i.toString());
    seg.innerText = s.shown.join("");
    container.appendChild(seg);
  }

  render() {
    this.build();
  }
}

export const hudAddressDefine = () => customElements.define(NAME, HudAddress);

export function hudAddress(props: Props, attach: HTMLElement) {
  let el: HudAddress | null = attach.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as HudAddress;
    attach.appendChild(el);
  }
  el.props = props;

  return el;
}
