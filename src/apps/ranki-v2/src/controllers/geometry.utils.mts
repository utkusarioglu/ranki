import type { LitElement } from "lit";
import type {
  Dims,
  DirectionalEvaluation,
  R2Sizing,
  UpdateStyle,
} from "./geometry.types.mts";

export class GeometryUtils {
  public static readonly childSizeEventName = "r2-child-size";

  public static evaluateChange(
    curr: R2Sizing,
    prev: UpdateStyle | null,
    prop: "width" | "height",
  ): DirectionalEvaluation {
    const isExpanding = curr[prop] > (prev ? prev[prop] : 0);
    const isContracting = curr[prop] < (prev ? prev[prop] : 0);
    const action = isExpanding ? "expand" : isContracting ? "contract" : "none";
    return {
      action,
      isExpanding,
      isContracting,
    };
  }

  public static emitConnected(host: LitElement) {
    host.dispatchEvent(
      new CustomEvent(GeometryUtils.childSizeEventName, {
        detail: {
          type: "connected",
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  public static emitDisconnected(host: LitElement) {
    host.dispatchEvent(
      new CustomEvent(GeometryUtils.childSizeEventName, {
        detail: {
          type: "disconnected",
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  public static emitSize(host: LitElement, { width, height }: Dims | DOMRect) {
    host.dispatchEvent(
      new CustomEvent(GeometryUtils.childSizeEventName, {
        detail: {
          type: "update",
          rect: { width, height },
        },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
