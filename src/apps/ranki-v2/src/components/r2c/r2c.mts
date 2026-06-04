import { LitElement } from "lit";
import { assertNever } from "_error/assertions.mjs";
import { ReconciliationUtils } from "_utils/reconciliation.utils.mjs";
import type { InformContext } from "_/controllers/geometry/geometry.types.mjs";
import type { AnimateableStyles } from "_/controllers/geometry/geometry.animator.types.mjs";

export type Other = {
  opacity: number;
};

export interface R2Animate extends LitElement {
  informStyle(pos: AnimateableStyles, context: InformContext): void;
}

export class R2C extends LitElement implements R2Animate {
  protected emitLeave() {
    this.dispatchEvent(ReconciliationUtils.leaveEvent());
  }

  public async leave(
    // @ts-expect-error
    stagger: number,
  ): Promise<void> {
    assertNever({
      why: "`animateLeave` method needs an override to be consumed",
    });
  }

  public async informStyle(
    // @ts-expect-error
    pos: AnimateableStyles,
    // @ts-expect-error
    context: InformContext,
  ): Promise<void> {
    assertNever({
      why: "`informStyle` method needs an override to be consumed",
    });
  }
}
