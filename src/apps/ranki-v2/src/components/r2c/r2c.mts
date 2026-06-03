import { LitElement } from "lit";
import { assertNever } from "_error/assertions.mjs";
import { ReconciliationUtils } from "_utils/reconciliation.mjs";
import type { InformContext } from "_/controllers/geometry.types.mjs";
import type { AnimateableStyles } from "_/controllers/geometry.animator.types.mjs";

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

  public async informStyle(
    pos: AnimateableStyles,
    context: InformContext,
  ): Promise<void> {
    assertNever({
      why: "`informStyle` method needs an override to be consumed",
    });
  }
}
