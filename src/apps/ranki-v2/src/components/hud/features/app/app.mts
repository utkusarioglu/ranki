import { RankiAnimation } from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import { type AnimationTypes } from "_components/animation/animation.mts";
import type { HudAppProps } from "_components/hud/hud.types.mts";
import styles from "./app.component.css?inline";
import type { WrappedState } from "_components/subtree/subtree.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";

export class HudApp extends RankiHudWc<HudAppProps> {
  protected static name = "ranki-hud-app" as const;
  protected animations: AnimationTypes = {
    show: RankiAnimation.expandXFadeIn(this, {
      initialCb: this.adjustWidth.bind(this),
    }),
    hide: RankiAnimation.collapseXFadeOut(this, {}),
  };

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private adjustWidth() {
    const container = this.shadowRoot!.querySelector(
      ".replacements",
    ) as HTMLDivElement;
    if (!container) {
      return;
    }

    const right = container.getBoundingClientRect().right;
    const left = this.getLeft();
    this.setProperties({ width: right - left + "px" });
  }

  hasNext(n: boolean) {
    this.setProperties({ "margin-right": n ? "1em" : 0 });
  }

  private build() {
    let container = this.getContainer();
    if (container) {
      return container;
    }
    const props = this.getCurr();
    [container] = this.createSingletonContainer([`error-${props.errorLevel}`]);

    const version = document.createElement("div");
    version.classList.add("version");
    version.innerText = props.parseMode;
    container.appendChild(version);

    if (props.hasReplacements) {
      const replacements = document.createElement("div");
      replacements.classList.add("replacements");
      replacements.innerText = "Δ";
      container.appendChild(replacements);
    }

    return container;
  }

  isActive(): boolean {
    return true;
  }

  canReconcile(s: WrappedState<HudAppProps>): ReconciliationAction {
    return s.type === "app" ? "mutate" : "remove";
  }

  render() {
    this.build();
    this.runAnimation("show");
    return this;
  }
}
