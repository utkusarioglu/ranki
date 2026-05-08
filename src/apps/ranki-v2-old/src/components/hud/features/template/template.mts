import styles from "./template.component.css?inline";
import type { HudTemplateProps } from "_components/hud/hud.types.mjs";
import { type ReconciliationAction } from "_components/wc/wc.mjs";
import { RCardInfo, type RCardInfoProps } from "./info.mts";
import { WcHudContainer } from "_components/hud/components/container.mjs";
import type { WrappedState } from "_components/wc/sub.mjs";

type T = HudTemplateProps;

export class RTemplate extends WcHudContainer<T, T, RCardInfo, RCardInfoProps> {
  public static readonly tag = "r-template" as const;

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  canReconcile(s: WrappedState<T>): ReconciliationAction {
    return s.type === "template" ? "mutate" : "remove";
  }

  protected createSubtreeChild(s: WrappedState<RCardInfoProps>) {
    const container = this.elements.get("container");
    const ch = RCardInfo.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }

  protected onStateChange(curr: T): void {
    this.subtree.reconcile([
      {
        type: "type",
        state: {
          animation: curr.animation,
          type: "type",
          text: curr.type,
        },
      },
      {
        type: "card",
        state: {
          animation: curr.animation,
          type: "card",
          text: curr.card,
        },
      },
      {
        type: "face",
        state: {
          animation: curr.animation,
          type: "face",
          text: curr.face,
        },
      },
    ]);
  }
}
