import { WcChip } from "_components/hud/components/chip.mjs";
import type { RTextProps } from "_components/text/text.mjs";
import type { ElemMin } from "_components/wc/sub.mjs";

export interface RCardTagProps {
  type: "card" | "type" | "face";
  text: string;
}

type ChildrenTypes = ElemMin<ChildrenProps>;
type ChildrenProps = RTextProps;

export class RCardTag extends WcChip<
  RCardTagProps,
  RCardTagProps,
  ChildrenTypes,
  ChildrenProps
> {
  public static readonly tag = "r-template-tag" as const;

  protected computePadding(curr: RCardTagProps): {
    paddingLeft: string;
    paddingRight: string;
  } {
    switch (curr.type) {
      case "card":
        return { paddingLeft: "8px", paddingRight: "8px" };
      default:
        return { paddingLeft: "16px", paddingRight: "16px" };
    }
  }

  protected reconcileChildren(curr: RCardTagProps) {
    const state = [
      {
        type: "text",
        state: { text: curr.text },
      },
    ];
    this.subtree.reconcile(state);
  }
}
