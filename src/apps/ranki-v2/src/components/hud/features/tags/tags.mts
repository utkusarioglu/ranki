import { HudShadowBase } from "../../hud-base.mts";
import type { HudTagListItem, HudTagsProps } from "../../hud.types.mts";
import { HudTagsTag } from "./HudTagsTag.mts";
import styles from "./tags.component.css?inline";

type Props = HudTagsProps;

export class HudTags extends HudShadowBase<Props> {
  private static name = "ranki-hud-tags";

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  connectedCallback() {
    this.animateEntry();
  }

  private animateEntry() {
    return new Promise<void>((r) => {
      this.addEventListener("transitionend", () => {
        r();
      });
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
    const props = this.getProps();
    const last = container.childNodes[props.count - 1] as HudTagsTag;
    const right = last.getRight();
    const left = this.getLeft();
    this.setProperties({ width: right - left + "px" });
  }

  exit() {
    this.animateExit();
  }

  private animateExit() {
    return new Promise<void>((r) => {
      this.addEventListener("transitionend", () => {
        this.remove();
        r();
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
    const props = this.getProps();
    const cn = container.childNodes.length;

    const sn = props.count;
    const rm: HudTagsTag[] = [];

    for (let i = 0; i < Math.max(cn, sn); i++) {
      const s = props.list[i];
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
    const tag = HudTagsTag.create({}, container);
    tag.classList.add("neutral");
    tag.setAttribute("data-index", i.toString());
    tag.addClass(s.type);
    tag.innerText = s.text || "";
  }

  render() {
    if (this.getProps().count > 0) {
      this.build();
    } else {
      this.exit();
    }
  }
}
