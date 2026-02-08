import styles from "./template.component.css?inline";
import type { HudTemplateProps } from "_components/hud/hud.types.mjs";
import type { WrappedState } from "_components/subtree/subtree.mjs";
import { type ReconciliationAction } from "_components/wc/wc.mjs";
import { RCardTag, type RCardTagProps } from "./tag.mts";
import { WcHudContainer } from "_components/hud/components/container.mjs";

type T = HudTemplateProps;

export class RTemplate extends WcHudContainer<T, T, RCardTag, RCardTagProps> {
  public static readonly tag = "r-template" as const;

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  canReconcile(s: WrappedState<T>): ReconciliationAction {
    return s.type === "template" ? "mutate" : "remove";
  }

  protected createSubtreeChild(s: WrappedState<RCardTagProps>) {
    const container = this.elements.get("container");
    const ch = RCardTag.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }

  protected onStateChange(curr: T): void {
    console.log("s", curr);
    this.subtree.reconcile([
      {
        type: "type",
        state: {
          type: "type",
          text: curr.type,
        },
      },
      {
        type: "card",
        state: {
          type: "card",
          text: curr.card,
        },
      },
      {
        type: "face",
        state: {
          type: "face",
          text: curr.face,
        },
      },
    ]);
  }
}
