import { RankiAnimation } from "../../../animation/animation.mts";
import { RankiHudWc } from "../../hud-wc/hud-wc.mts";
import { type AnimationTypes } from "../../../animation/animation.mts";
import type { HudTagListItem, HudTagsProps } from "../../hud.types.mts";
import { HudTagsTag } from "./HudTagsTag.mts";
import styles from "./tags.component.css?inline";

export class HudTags extends RankiHudWc<HudTagsProps> {
  protected static name = "ranki-hud-tags" as const;
  protected animations: AnimationTypes = {
    show: RankiAnimation.expandXFadeIn(this, {
      twoRafCb: this.adjustWidth.bind(this),
    }),
    hide: RankiAnimation.expandXFadeIn(this, {
      twoRaf: {
        "margin-right": 0,
        opacity: 0,
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
    const props = this.getCurr();
    const last = container.childNodes[props.count - 1] as HudTagsTag;
    const right = last.getRight();
    const left = this.getLeft();
    this.setProperties({ width: right - left + "px" });
  }

  private subtree(container: HTMLDivElement) {
    const props = this.getCurr();
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
        r.remove();
      });
  }

  private build() {
    const [container] = this.createSingletonContainer();
    this.subtree(container);
    this.adjustWidth();
  }

  mutateTag(s: HudTagListItem, e: HTMLDivElement) {
    e.className = s.type;
    e.innerText = s.text || "";
  }

  createTag(s: HudTagListItem, i: number, container: HTMLDivElement) {
    const tag = HudTagsTag.createAndAttach({}, container);
    tag.classList.add("neutral");
    tag.setAttribute("data-index", i.toString());
    tag.addClass(s.type);
    tag.innerText = s.text || "";
  }

  render() {
    if (this.getCurr().count > 0) {
      this.build();
      this.runAnimation("show");
    } else {
      this.runAnimation("hide");
    }
    return this;
  }
}
