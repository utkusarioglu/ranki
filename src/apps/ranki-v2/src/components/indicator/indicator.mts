import { RankiWc } from "_components/ranki-wc/ranki-wc.mts";
import type {
  RankiIndicatorDefinition,
  RankiIndicatorState,
} from "_config/config.types.mts";
import { assertNotUndefined } from "_error/assertions.mts";
import style from "./indicator.component.css?inline";
import { IndicatorPattern } from "./pattern.mts";

export class RankiIndicator extends RankiWc<RankiIndicatorState> {
  public static name = "ranki-indicator" as const;
  private active: string = "transparent";

  constructor() {
    super(true);
    this.pushStyles(style);
  }

  private build() {
    const config = this.getCurr();
    const collection = config.indicatorCollection;

    const newPattern: RankiIndicatorDefinition[] = [];
    config.cues.forEach((c) => {
      if (!c.indicator || c.indicator === "none") {
        return;
      }
      const ind = collection.find((v) => v.name === c.indicator);
      assertNotUndefined(ind, {
        why: "Indicator with the given name doesn't exist",
        details: { indicator: c.indicator, indicators: collection },
      });
      newPattern.push(ind);
    });

    const newString = newPattern.map((v) => v.style).join(",\n");
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
