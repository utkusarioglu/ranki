import type { HudAppProps } from "_components/hud/hud.types.mjs";
import { type ReconciliationAction } from "_components/wc/wc.mjs";
import styles from "./notify.component.css?inline";
import { RNotifyChip, type RNotifyChipProps } from "./chip.mts";
import { type WrappedState } from "_components/wc/sub.mjs";
import { WcHudContainer } from "_components/hud/components/container.mjs";

type T = HudAppProps;

export class RNotify extends WcHudContainer<
  T,
  T,
  RNotifyChip,
  RNotifyChipProps
> {
  public static readonly tag = "r-notify" as const;

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  canReconcile(s: WrappedState<T>): ReconciliationAction {
    return s.type === "notify" ? "mutate" : "remove";
  }

  protected createSubtreeChild(s: WrappedState<RNotifyChipProps>) {
    const container = this.elements.get("container")!;
    const ch = RNotifyChip.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }

  protected onStateChange(curr: HudAppProps): void {
    this.subtree.reconcile([
      {
        type: "chip",
        state: {
          type: "version",
          text: curr.parseMode,
        },
      },
      ...(curr.hasReplacements
        ? [
            {
              type: "chip",
              state: {
                type: "delta" as "delta",
                text: "Δ",
              },
            },
          ]
        : []),
    ]);
  }
}
