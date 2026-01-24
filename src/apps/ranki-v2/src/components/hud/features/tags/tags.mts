import type { HudTagListItem, HudTagsProps } from "../../hud.types.mts";
import type { HudTagsTag } from "./HudTagsTag.mts";
import styles from "./tags.component.css?inline";

const NAME = "ranki-hud-tags";
type Props = HudTagsProps;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class HudTags extends HTMLElement {
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
    c.classList.add("exiting");
    c.childNodes.forEach((n) => {
      (n as HudTagsTag).exit();
    });
  }

  private container() {
    let c = this.shadowRoot!.querySelector("div.container") as HTMLDivElement;
    if (c) {
      return c;
    }
    const container = document.createElement("div");
    container.classList.add("container");
    this.shadowRoot!.replaceChildren(container);
    return container;
  }

  private subtree(container: HTMLDivElement) {
    const cn = container.childNodes.length;
    const sn = this.curr.count;
    const rm: HudTagsTag[] = [];

    for (let i = 0; i < Math.max(cn, sn); i++) {
      const s = this.curr.list[i];
      if (s) {
        const e = this.shadowRoot!.querySelector(
          `[data-index="${i}"]`,
        ) as HTMLDivElement;
        if (!e) {
          this.createTag(s, i, container);
        } else {
          this.mutateTag(s, e);
        }
      } else {
        rm.push(container.childNodes[i] as HudTagsTag);
      }
    }
    rm.length &&
      rm.forEach((r) => {
        r.exit();
      });
  }

  private build() {
    const container = this.container();
    this.subtree(container);
    this.adjustWidth();
  }

  mutateTag(s: HudTagListItem, e: HTMLDivElement) {
    e.className = s.type;
    e.innerText = s.text || "";
  }

  createTag(s: HudTagListItem, i: number, container: HTMLDivElement) {
    const tag = document.createElement("hud-tags-tag");
    tag.classList.add("neutral");
    tag.setAttribute("data-index", i.toString());
    tag.classList.add(s.type);
    tag.innerText = s.text || "";
    container.appendChild(tag);
  }

  render() {
    if (this.curr.count > 0) {
      this.build();
    } else {
      this.exit();
    }
  }

  private getLeft() {
    return this.getBoundingClientRect().left;
  }

  private adjustWidth() {
    const container = this.shadowRoot!.querySelector(
      "div.container",
    ) as HTMLDivElement;
    if (!container) {
      return;
    }
    const last = container.childNodes[this.curr.count - 1] as HudTagsTag;
    const right = last.getRight();
    const left = this.getLeft();
    this.style.setProperty("width", right - left + "px");
  }
}

export const hudTagsDefine = () => customElements.define(NAME, HudTags);

export function hudTags(props: Props, attach: HTMLElement) {
  let el: HudTags | null = attach.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as HudTags;
    attach.appendChild(el);
  }
  el.props = props;

  return el;
}
