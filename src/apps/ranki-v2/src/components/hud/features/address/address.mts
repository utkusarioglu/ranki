import { assertNever } from "../../../../error/assertions.mts";
import type { HudAddressProps, HudAddressSegment } from "../../hud.types.mts";
import styles from "./address.component.css?inline";
import type { HudAddressCrumb } from "./HudAddressCrumb.mts";

const NAME = "ranki-hud-address";
type Props = HudAddressProps;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class HudAddress extends HTMLElement {
  private curr!: Props;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [sheet];
  }

  set props(props: Props) {
    this.curr = props;
    this.render();
  }

  // SAME
  connectedCallback() {
    this.style.setProperty("opacity", "0");
    this.style.setProperty("width", "0");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "1");
        this.adjustWidth();
      });
    });
  }

  // SAME
  exit() {
    const width = this.getBoundingClientRect().width;
    this.style.setProperty("width", width + "px");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // this.drain();
        this.style.setProperty("width", "0px");
        this.style.setProperty("opacity", "0");
        this.style.setProperty("margin-right", "0");
        this.addEventListener("transitionend", () => this.remove(), {
          once: true,
        });
      });
    });
  }

  private container(): HTMLDivElement {
    let c = this.shadowRoot!.querySelector("div.container") as HTMLDivElement;
    if (c) {
      return c;
    }
    c = document.createElement("div");
    c.classList.add("container");

    this.shadowRoot!.appendChild(c);
    return c;
  }

  private build() {
    const container = this.container();
    this.subtree(container);
    this.adjustWidth();
  }

  private subtree(container: HTMLDivElement) {
    const cn = container.childNodes.length;
    const sn = this.curr.segments.length;
    const rm: HudAddressCrumb[] = [];

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
        rm.push(container.childNodes[i] as HudAddressCrumb);
      }
    }
    rm.length &&
      rm.forEach((r) => {
        r.exit();
      });
  }

  private adjustWidth() {
    const container = this.shadowRoot!.querySelector(
      "div.container",
    ) as HTMLDivElement;
    if (!container) {
      return;
    }
    const right = (
      container.childNodes[this.curr.segments.length - 1] as HudAddressCrumb
    ).getRight();
    const left = this.getLeft();
    this.style.setProperty("width", right - left + "px");
  }

  private getLeft() {
    return this.getBoundingClientRect().left;
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
    const seg = document.createElement("hud-address-crumb");
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
