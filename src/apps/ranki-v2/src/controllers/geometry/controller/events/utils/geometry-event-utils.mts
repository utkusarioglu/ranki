import type { LitElement } from "lit";

import type { WidthHeight } from "../../../geometry-style.types.mjs";
import type { EmitModes } from "../geometry-events.types.mjs";

export class GeometryEventUtils {
  public static readonly geometryEventName = "r2-geometry";

  public static emitLeave(host: LitElement) {
    host.dispatchEvent(
      new CustomEvent(this.geometryEventName, {
        bubbles: true,
        composed: true,
        detail: {
          intent: "leave",
        },
      }),
    );
  }

  public static emitMode(host: LitElement, mode: EmitModes) {
    host.dispatchEvent(
      new CustomEvent(this.geometryEventName, {
        bubbles: true,
        composed: true,
        detail: {
          intent: "mode",
          mode,
        },
      }),
    );
  }

  public static emitUpdate(host: LitElement, sizing: WidthHeight) {
    host.dispatchEvent(
      new CustomEvent(this.geometryEventName, {
        bubbles: true,
        composed: true,
        detail: {
          intent: "update",
          style: sizing,
        },
      }),
    );
  }
}
