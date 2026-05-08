import type { WrappedState } from "_components/wc/sub.mjs";
import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";
import type { RankiPropAnimationBlock } from "_config/config.types.mjs";

const DUR = 2e3;
// const DUR = 4e2;

export interface RIndicatorPatternProps {
  animation: RankiPropAnimationBlock;
  pattern: string;
}

type RIndicatorPatternState = RIndicatorPatternProps;

export class RIndicatorPattern extends Wc<RIndicatorPatternProps> {
  public static readonly tag = "r-indicator-pattern" as const;

  isActive(): boolean {
    return this.state.curr().pattern !== "transparent";
  }

  setProps(s: RIndicatorPatternProps) {
    this.state.set(s);
  }

  canReconcile(s: WrappedState<RIndicatorPatternState>): ReconciliationAction {
    return s.state.pattern === this.state.curr().pattern ? "mutate" : "remove";
  }

  initialize() {
    this.animation
      .pushPreset("enter", () => {
        const curr = this.state.curr();
        return {
          keyframes: [{ opacity: 0 }, { opacity: 1 }],
          options: {
            duration: curr.animation.enabled ? DUR : 0,
            fill: "both",
          },
        };
      })
      .pushPreset("exit", () => {
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

  protected onStateChange(curr: RIndicatorPatternState): void {
    this.style.background = curr.pattern;
  }
}
