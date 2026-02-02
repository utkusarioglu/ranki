import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud//hud-wc/hud-wc.mts";
import type { HudCardProps } from "_components/hud/hud.types.mts";
import styles from "./card.component.css?inline";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import type { WrappedState } from "_components/subtree/subtree.mjs";

export class HudCard extends RankiHudWc<HudCardProps> {
  protected static name = "ranki-hud-card" as const;
  protected animations: AnimationTypes = {
    show: RankiAnimation.expandXFadeIn(this, {
      initialCb: this.adjustWidth.bind(this),
    }),
    hide: RankiAnimation.collapseXFadeOut(this),
  };

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  hasNext(n: boolean) {
    this.setProperties({ "margin-right": n ? "1em" : 0 });
  }

  canReconcile(s: WrappedState<HudCardProps>): ReconciliationAction {
    return s.type === "card" ? "mutate" : "remove";
  }

  private adjustWidth() {
    const face = this.shadowRoot!.querySelector("div.face") as HTMLDivElement;
    if (!face) {
      return;
    }

    const right = face.getBoundingClientRect().right;
    const left = this.getLeft();
    this.setProperties({ width: right - left + "px" });
  }

  private build() {
    const [container, existing] = this.createSingletonContainer();
    if (existing) {
      return container;
    }
    const props = this.getCurr();

    const type = document.createElement("div");
    type.classList.add("type");
    type.innerText = props.type;
    container.appendChild(type);

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerText = props.card;
    container.appendChild(card);

    const face = document.createElement("div");
    face.classList.add("face");
    face.innerText = props.face;
    container.appendChild(face);

    return container;
  }

  private setType(c: HTMLDivElement, type: string) {
    const e = c.querySelector(".type") as HTMLDivElement;
    e.innerText = type;
  }

  private setCard(c: HTMLDivElement, card: string) {
    const e = c.querySelector(".card") as HTMLDivElement;
    e.innerText = card;
  }

  private setFace(c: HTMLDivElement, face: string) {
    const e = c.querySelector(".face") as HTMLDivElement;
    e.innerText = face;
  }

  isActive(): boolean {
    return true;
  }

  render() {
    const container = this.build();
    const props = this.getCurr();
    this.setType(container, props.type);
    this.setCard(container, props.card);
    this.setFace(container, props.face);
    this.runAnimation("show");
    return this;
  }
}
