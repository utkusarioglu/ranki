import { assertNever } from "../../../../error/assertions.mts";
import { HudShadowBase } from "../../hud-base.mts";
import type { HudAddressProps, HudAddressSegment } from "../../hud.types.mts";
import styles from "./address.component.css?inline";
import { HudAddressCrumb } from "./HudAddressCrumb.mts";

type Props = HudAddressProps;

export class HudAddress extends HudShadowBase<Props> {
  private static name = "ranki-hud-address";
  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  connectedCallback() {
    this.animateEntry();
  }

  private animateEntry() {
    this.setProperties({ opacity: 0, width: 0 });
    this.twoRaf(() => {
      this.setProperties({ opacity: 1 });
      this.adjustWidth();
    });
  }

  private animateExit() {
    this.addEventListener("transitionend", () => this.remove(), {
      once: true,
    });
    const width = this.getWidth();
    this.setProperties({ width: width + "px" });
    this.twoRaf(() => {
      this.setProperties({
        width: 0,
        opacity: 0,
        "margin-right": 0,
      });
    });
  }

  exit() {
    this.animateExit();
  }

  private adjustWidth() {
    const container = this.shadowRoot!.querySelector(
      "div.container",
    ) as HTMLDivElement;
    if (!container) {
      return;
    }
    const right = (
      container.childNodes[
        this.getProps().segments.length - 1
      ] as HudAddressCrumb
    ).getRight();
    const left = this.getLeft();
    this.style.setProperty("width", right - left + "px");
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
    const sn = this.getProps().segments.length;
    const rm: HudAddressCrumb[] = [];

    for (let i = 0; i < Math.max(cn, sn); i++) {
      const s = this.getProps().segments[i];
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
          details: { segments: this.getProps().segments, segment: s },
        });
    }
    e.innerText = s.shown.join("");
  }

  private createCrumb(s: HudAddressSegment, i: number, container: Element) {
    const crumb = HudAddressCrumb.create({}, container);
    switch (s.mode) {
      case "trim":
      case "hide":
      case "separator":
        crumb.addClass("divider");
        break;
      case "show":
        crumb.addClass("segment");
        break;
      default:
        assertNever({
          why: "Unrecognized address segment mode",
          details: { segments: this.getProps().segments, segment: s },
        });
    }
    crumb.setAttribute("data-index", i.toString());
    crumb.innerText = s.shown.join("");
  }

  render() {
    this.build();
  }
}
