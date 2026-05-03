import { WcChip } from "_components/hud/components/chip.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import type { RTextProps } from "_components/text/text.mjs";
import type { ElemMin } from "_components/wc/sub.mjs";

type ChildrenTypes = ElemMin<ChildrenProps>;
type ChildrenProps = RTextProps;

export class RTag extends WcChip<
  HudTagListItem,
  HudTagListItem,
  ChildrenTypes,
  ChildrenProps
> {
  public static readonly tag = "r-tag" as const;

  hasNext(n: boolean) {
    this.css.set({ "margin-right": n ? "5px" : 0 });
  }

  protected reconcileChildren(curr: HudTagListItem) {
    const state = [
      {
        type: "text",
        state: {
          animation: curr.animation,
          text: curr.text,
        },
      },
    ];
    this.subtree.reconcile(state);
  }
}
