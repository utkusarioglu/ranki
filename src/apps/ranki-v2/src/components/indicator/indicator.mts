import type {
  RankiAppConfig,
  RankiIndicatorDefinition,
} from "../../config/config.types.mts";
import { assertNotUndefined } from "../../error/assertions.mts";
import style from "./indicator.component.css?inline";
import { RankiWc } from "../ranki-wc/ranki-wc.mts";
import { IndicatorPattern } from "./pattern.mts";

export class RankiIndicator extends RankiWc<RankiAppConfig> {
  public static name = "ranki-indicator" as const;
  private active: string = "transparent";

  constructor() {
    super(true);
    this.pushStyles(style);
  }

  private build() {
    const config = this.getCurr();
    const indicators = config.indicators;

    const newPattern: RankiIndicatorDefinition[] = [];
    config.design.cueRecord.forEach((c) => {
      if (!c.indicator || c.indicator === "none") {
        return;
      }
      const ind = indicators.find((v) => v.name === c.indicator);
      assertNotUndefined(ind, {
        why: "Indicator with the given name doesn't exist",
        details: { indicator: c.indicator, indicators },
      });
      newPattern.push(ind);
    });

    const newString = newPattern.map((v) => v.style).join(", ");
    if (newString !== this.active) {
      for (let c of this.shadowRoot!.children) {
        c.remove();
      }
      IndicatorPattern.createAndAttach(newString, this.shadowRoot!);
    }
    this.active = newString;
  }

  render(): this {
    this.build();
    return this;
  }
}
