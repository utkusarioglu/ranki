import type { CueRecord } from "../../../../config/config.types.mts";
import { HudShadowBase, type AnimationTypes } from "../../hud-base.mts";
import type { HudCuesProps } from "../../hud.types.mts";
import styles from "./cues.component.css?inline";
import { HudCuesCue } from "./hud-cue.mts";

type Props = HudCuesProps;

export class HudCues extends HudShadowBase<Props> {
  protected static name = "ranki-hud-cues" as const;
  protected animations: AnimationTypes = {
    enter: this.animateEntry.bind(this),
    exit: this.animateExit.bind(this),
  };

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private animateEntry() {
    return new Promise<void>((r) => {
      this.addEventListener(
        "transitionend",
        () => {
          r();
        },
        {
          once: true,
        },
      );
      this.setProperties({ opacity: 0, width: 0 });
      this.twoRaf(() => {
        this.setProperties({ opacity: 1 });
        this.adjustWidth();
      });
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
      container.childNodes[this.getProps().length - 1] as HudCuesCue
    ).getRight();
    const left = this.getLeft();
    this.style.setProperty("width", right - left + "px");
  }

  private animateExit() {
    return new Promise<void>((r) => {
      this.addEventListener(
        "transitionend",
        () => {
          this.remove();
          r();
        },
        {
          once: true,
        },
      );
      const width = this.getWidth();
      this.setProperties({ width: width + "px" });
      this.twoRaf(() => {
        this.setProperties({
          width: 0,
          opacity: 0,
          "margin-right": 0,
        });
      });
    });
  }

  private container() {
    const c = this.shadowRoot!.querySelector("div.container") as HTMLDivElement;
    if (c) {
      return c;
    }
    const container = document.createElement("div");
    container.classList.add("container");
    this.shadowRoot!.replaceChildren(container);
    return container;
  }

  private build() {
    const container = this.container();
    const props = this.getProps();
    const cn = container.childNodes.length;
    const sn = props.length;
    const rm: HudCuesCue[] = [];

    for (let i = 0; i < Math.max(cn, sn); i++) {
      const s = props[i];
      if (s) {
        const e = this.shadowRoot!.querySelector(
          `[data-index="${i}"]`,
        ) as HTMLDivElement;
        if (!e) {
          this.createCue(s, i, container);
        } else {
          this.mutateCue(s, e);
        }
      } else {
        rm.push(container.childNodes[i] as HudCuesCue);
      }
    }
    rm.length &&
      rm.forEach((r) => {
        r.exit();
      });
    this.adjustWidth();
    return container;
  }

  private createCue(c: CueRecord, i: number, container: HTMLDivElement) {
    const cue = HudCuesCue.create({}, container);
    cue.innerText = c.message || c.indicator;
    cue.addClass("cue", `issuer-${c.issuer}`, `kind-${c.kind}`);
    cue.setAttribute("data-index", i.toString());
  }

  private mutateCue(s: CueRecord, e: HTMLDivElement) {
    e.innerText = s.message;
  }

  render() {
    if (this.getProps().length) {
      this.build();
    } else {
      this.remove();
    }
  }
}
