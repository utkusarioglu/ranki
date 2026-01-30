import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type {
  HudAddressProps,
  HudAddressSegment,
} from "_components/hud/hud.types.mts";
import { assertNever } from "_error/assertions.mts";
import styles from "./address.component.css?inline";
import { HudAddressCrumb } from "./HudAddressCrumb.mts";

export class HudAddress extends RankiHudWc<HudAddressProps> {
  protected static name = "ranki-hud-address" as const;
  protected animations: AnimationTypes = {
    show: RankiAnimation.fadeIn(this, {
      setup: {
        "margin-right": 0,
      },
      initial: {
        "margin-right": "1em",
      },
    }),
  };

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private adjustWidth() {
    const container = this.getContainer();
    if (!container) {
      return;
    }
    const right = (
      container.childNodes[
        this.getCurr().segments.length - 1
      ] as HudAddressCrumb
    ).getRight();
    const left = this.getLeft();
    this.style.setProperty("width", right - left + "px");
  }

  private build() {
    const [container] = this.createSingletonContainer();
    this.subtree(container);
    this.adjustWidth();
  }

  private subtree(container: HTMLDivElement) {
    const cn = container.childNodes.length;
    const sn = this.getCurr().segments.length;
    const rm: HudAddressCrumb[] = [];

    for (let i = 0; i < Math.max(cn, sn); i++) {
      const s = this.getCurr().segments[i];
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
        r.remove();
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
          details: { segments: this.getCurr().segments, segment: s },
        });
    }
    e.innerText = s.shown.join("");
  }

  private createCrumb(s: HudAddressSegment, i: number, container: Element) {
    const crumb = HudAddressCrumb.createAndAttach({}, container);
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
          details: { segments: this.getCurr().segments, segment: s },
        });
    }
    crumb.setAttribute("data-index", i.toString());
    crumb.innerText = s.shown.join("");
  }

  render() {
    this.build();
    this.runAnimation("show");
    return this;
  }
}
