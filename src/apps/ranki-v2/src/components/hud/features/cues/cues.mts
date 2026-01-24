import type { CueRecord } from "../../../../config/config.types.mts";
import type { HudCuesProps } from "../../hud.types.mts";
import styles from "./cues.component.css?inline";
import type { HudCuesCue } from "./hud-cue.mts";

const NAME = "ranki-hud-cues";
type Props = HudCuesProps;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class HudCues extends HTMLElement {
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
        this.drain();
        this.style.setProperty("width", "0px");
        this.style.setProperty("opacity", "0");
        this.style.setProperty("margin-right", "0");
        this.addEventListener("transitionend", () => this.remove(), {
          once: true,
        });
      });
    });
  }

  private drain() {
    const c = this.shadowRoot?.querySelector("div.container") as HTMLDivElement;
    if (!c) {
      return;
    }
    // c.classList.add("exiting");
    c.childNodes.forEach((n) => {
      (n as HudCuesCue).exit();
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
    const cn = container.childNodes.length;
    const sn = this.curr.length;
    const rm: HudCuesCue[] = [];

    for (let i = 0; i < Math.max(cn, sn); i++) {
      const s = this.curr[i];
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
    const cue = document.createElement("hud-cues-cue");
    cue.innerText = c.message || c.indicator;
    cue.classList.add("cue", `issuer-${c.issuer}`, `kind-${c.kind}`);
    cue.setAttribute("data-index", i.toString());
    container.appendChild(cue);
  }

  private mutateCue(s: CueRecord, e: HTMLDivElement) {
    e.innerText = s.message;
  }

  private adjustWidth() {
    const container = this.shadowRoot!.querySelector(
      "div.container",
    ) as HTMLDivElement;
    if (!container) {
      return;
    }

    const right = (
      container.childNodes[this.curr.length - 1] as HudCuesCue
    ).getRight();
    const left = this.getLeft();
    this.style.setProperty("width", right - left + "px");
  }

  private getLeft() {
    return this.getBoundingClientRect().left;
  }

  render() {
    if (this.curr.length) {
      this.build();
    } else {
      this.remove();
    }
  }
}

export const hudCuesDefine = () => customElements.define(NAME, HudCues);

export function hudCues(props: Props, attach: HTMLElement) {
  let el: HudCues | null = attach.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as HudCues;
    attach.appendChild(el);
  }
  el.props = props;

  return el;
}
