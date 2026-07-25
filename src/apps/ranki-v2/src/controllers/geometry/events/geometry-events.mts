import type { Dims } from "_controllers/geometry/geometry.types.mjs";
import type { LitElement } from "lit";
import type { EmitModes } from "./geometry-events.types.mts";

export class GeometryEvents {
  public static readonly geometryEventName = "r2-geometry";

  public static emitLeave(host: LitElement) {
    host.dispatchEvent(
      new CustomEvent(this.geometryEventName, {
        detail: {
          intent: "leave",
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  public static emitMode(host: LitElement, mode: EmitModes) {
    host.dispatchEvent(
      new CustomEvent(this.geometryEventName, {
        detail: {
          intent: "mode",
          mode,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  public static emitUpdate(host: LitElement, { width, height }: Dims) {
    host.dispatchEvent(
      new CustomEvent(this.geometryEventName, {
        detail: {
          intent: "update",
          rect: { width, height },
        },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
