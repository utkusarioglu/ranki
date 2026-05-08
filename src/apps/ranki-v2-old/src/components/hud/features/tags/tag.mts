import { WcChip } from "_components/hud/components/chip.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import type { RTextProps } from "_components/text/text.mjs";
import type { ElemMin } from "_components/wc/sub.mjs";

type ChildrenTypes = ElemMin<ChildrenProps>;
type ChildrenProps = RTextProps;

const DUR = 4e2;

export class RTag extends WcChip<
  HudTagListItem,
  HudTagListItem,
  ChildrenTypes,
  ChildrenProps
> {
  public static readonly tag = "r-tag" as const;

  hasNext(n: boolean) {
    const curr = this.state.curr();
    const m = this.css.getMarginRight();
    this.animation.animate("margin-right", {
      keyframes: [
        {
          marginRight: m,
        },
        {
          marginRight: n ? "5px" : 0,
        },
      ],
      options: {
        duration: curr.animation.enabled ? DUR : 0,
        fill: "both",
      },
    });
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
