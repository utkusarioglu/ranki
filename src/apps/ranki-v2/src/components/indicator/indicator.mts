import type {
  RankiIndicatorDefinition,
  RankiIndicatorState,
} from "_config/config.types.mts";
import { assertNotUndefined } from "_error/assertions.mts";
import style from "./indicator.component.css?inline";
import { RIndicatorPattern, type RIndicatorPatternProps } from "./pattern.mts";
import { Wc } from "_components/wc/wc.mjs";
import { WcSub, type WrappedState } from "_components/wc/sub.mjs";

const DUR = 4e2;

export class RIndicator extends Wc<RankiIndicatorState> {
  public static readonly tag = "r-indicator" as const;
  private subtree = new WcSub<RIndicatorPattern, RIndicatorPatternProps>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });

  constructor() {
    super(true);
    this.css.pushStyles(style);
  }

  private removeSubtreeChild(e: RIndicatorPattern) {
    e.remove();
  }

  private createSubtreeChild(state: WrappedState<RIndicatorPatternProps>) {
    return RIndicatorPattern.create.instance(state.state, this.shadowRoot!);
  }

  initialize(): void {
    this.animation.pushPreset("exit", () => {
      const curr = this.state.curr();
      return {
        keyframes: [{ opacity: 1 }, { opacity: 0 }],
        options: {
          duration: curr.animation.enabled ? DUR : 0,
          fill: "both",
        },
      };
    });
  }

  protected onStateChange(curr: RankiIndicatorState): void {
    const config = curr;
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
    this.subtree.reconcile([
      {
        type: "indicator",
        state: {
          animation: curr.animation,
          pattern: newString,
        },
      },
    ]);
  }
}
