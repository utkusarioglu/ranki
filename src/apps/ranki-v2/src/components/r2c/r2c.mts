import { LitElement } from "lit";
import { assertNever } from "_error/assertions.mjs";
import type { InformContext } from "_controllers/geometry/geometry.types.mjs";
import type { AnimateableStyles } from "_controllers/geometry/geometry.animator.types.mjs";

export type Other = {
  opacity: number;
};

export class R2C extends LitElement {
  public leave() {
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
