import type { HudAppProps } from "_components/hud/hud.types.mjs";
import { type ReconciliationAction } from "_components/wc/wc.mjs";
import styles from "./notify.component.css?inline";
import { RNotifyChip, type RNotifyChipProps } from "./chip.mts";
import { type WrappedState } from "_components/sub/sub.mjs";
import { WcHudContainer } from "_components/hud/components/container.mjs";

type T = HudAppProps;

export class RNotify extends WcHudContainer<
  T,
  T,
  RNotifyChip,
  RNotifyChipProps
> {
  public static readonly tag = "r-notify" as const;
  // private subtree = new WcSub<RNotifyChip, RNotifyChipProps>({
  //   create: this.createSubtreeChild.bind(this),
  //   remove: this.removeSubtreeChild.bind(this),
  // });

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  // isActive(): boolean {
  //   return !!this.subtree.getAll().length;
  // }

  canReconcile(s: WrappedState<T>): ReconciliationAction {
    return s.type === "notify" && !!this.subtree.getAll().length
      ? "mutate"
      : "remove";
  }
  // canReconcile(curr: ): ReconciliationAction {

  // }
  // canReconcile(): ReconciliationAction {
  //   return "mutate";
  // }

  // setProps(e: T) {
  //   this.state.set(e);
  //   return this;
  // }

  // hasNext(n: boolean) {
  //   this.css.set({ "margin-right": n ? "1em" : 0 });
  // }

  // initialize(): void {
  //   this.elements.create("container", {
  //     tag: "div",
  //     classes: ["container"],
  //   });
  // }

  protected createSubtreeChild(s: WrappedState<RNotifyChipProps>) {
    const container = this.elements.get("container")!;
    const ch = RNotifyChip.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }

  // protected removeSubtreeChild(e: RNotifyChip) {
  //   e.remove();
  // }

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
