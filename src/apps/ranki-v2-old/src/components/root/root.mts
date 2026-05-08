import { createDesign } from "_/design/design.mjs";
import { RChallenge } from "_components/challenge/challenge.mjs";
import { RHud } from "_components/hud/hud.mjs";
import { RIndicator } from "_components/indicator/indicator.mjs";
import { Wc } from "_components/wc/wc.mjs";
import type { RankiState } from "_config/config.types.mjs";
// import "./root.component.css";
import styles from "./root.component.css?inline";

export class RRoot extends Wc<RankiState> {
  public static readonly tag = "r-root";

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  initialize(): void {
    this.elements.create("container", {
      tag: "div",
      classes: ["container"],
    });
  }

  onStateChange(curr: RankiState): void {
    const container = this.elements.get<HTMLDivElement>("container")!;
    RIndicator.create.singleton(curr.indicator, this.shadowRoot!);
    createDesign(curr.design, document.documentElement, this);
    RHud.create.singleton(curr.hud, container);
    RChallenge.create.singleton(curr.challenge, container);
  }
}
