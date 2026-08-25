export type { InformedChildStyle } from "_controllers/geometry/geometry.mjs";
import { assertNever } from "_error/assertions.mjs";
import { LitElement } from "lit";

export class R2C extends LitElement {
  /**
   * @dev
   * #1 Has to be defined for the children to have function shape suggestion
   */
  public async informStyle(
    // @ts-expect-error #1
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pos: InformedChildStyle,
  ): Promise<void> {
    assertNever({
      why: "`informStyle` method needs an override to be consumed",
    });
  }

  public leave() {
    assertNever({
      why: "`animateLeave` method needs an override to be consumed",
    });
  }
}
