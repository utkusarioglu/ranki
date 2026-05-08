import type {
  HudTagListItem,
  HudTagsProps,
} from "_components/hud/hud.types.mjs";
import { type ReconciliationAction } from "_components/wc/wc.mjs";
import styles from "./tags.component.css?inline";
import { RTag } from "./tag.mts";
import { type WrappedState } from "_components/wc/sub.mjs";
import { WcHudContainer } from "_components/hud/components/container.mjs";

type T = HudTagsProps;

export class RTags extends WcHudContainer<T, T, RTag, HudTagListItem> {
  public static readonly tag = "r-tags" as const;

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  canReconcile(s: WrappedState<T>): ReconciliationAction {
    return s.type === "tags" ? "mutate" : "remove";
  }

  protected createSubtreeChild(s: WrappedState<HudTagListItem>) {
    const container = this.elements.get("container")!;
    const ch = RTag.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }

  protected onStateChange(curr: T): void {
    this.subtree.reconcile(
      curr.list.map(({ type, text }) => ({
        type,
        state: {
          animation: curr.animation,
          type,
          text,
        },
      })),
    );
  }
}
