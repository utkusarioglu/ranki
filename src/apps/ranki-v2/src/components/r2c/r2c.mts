import { LitElement } from "lit";
import { assertNever } from "_error/assertions.mjs";
import type {
  InformContext,
  InformedChildStyle,
} from "_controllers/geometry/controller/geometry-controller.types.mjs";

export class R2C extends LitElement {
  public leave() {
    assertNever({
      why: "`animateLeave` method needs an override to be consumed",
    });
  }

  public async informStyle(
    // @ts-expect-error
    pos: InformedChildStyle,
    // @ts-expect-error
    context: InformContext,
  ): Promise<void> {
    assertNever({
      why: "`informStyle` method needs an override to be consumed",
    });
  }
}
