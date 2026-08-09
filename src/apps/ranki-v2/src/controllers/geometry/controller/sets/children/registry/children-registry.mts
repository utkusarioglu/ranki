import type { R2C } from "_components/r2c/r2c.mjs";

import type {
  R2CNewChildSizeEvent,
  R2CNewChildSizeEventIntent,
} from "../../../events/geometry-events.types.mjs";
import type { EmittedComponentState } from "./children-registry.types.mjs";
import { assertNever } from "_error/assertions.mjs";

export class ChildrenRegistry {
  private readonly dims = new WeakMap<R2C, EmittedComponentState>();

  public getOrdered(serial: R2C[]) {
    const ordered: EmittedComponentState[] = [];
    for (const component of serial) {
      const dims = this.dims.get(component);
      if (!dims) {
        ordered.push({
          intent: "none",
          mode: "idle",
        });
      } else {
        ordered.push(dims);
      }
    }
    return ordered;
  }

  /**
   * @dev
   * #1 This crates uncertainty about what properties exist in the object retrieved from the map
   */
  public update(target: R2C, detail: R2CNewChildSizeEvent) {
    switch (detail.type) {
      case "intent":
        return this.updateIntent(target, detail);
      case "mode":
        this.dims.set(target, {
          intent: "enter",
          ...this.dims.get(target),
          mode: detail.mode,
        });
        break;

      default:
        assertNever({
          why: "Unknown update type",
          details: { detail, tagName: target.tagName },
        });
    }
  }

  private updateIntent(target: R2C, detail: R2CNewChildSizeEventIntent) {
    switch (detail.intent) {
      case "disconnected":
        this.dims.delete(target);
        break;
      case "leave":
        this.dims.set(target, {
          mode: "idle",
          ...this.dims.get(target),
          ...detail,
        });
        break;
      case "update":
        if (this.dims.has(target)) {
          this.dims.set(target, {
            intent: detail.intent,
            mode: detail.mode || "idle",
            style: detail.style,
          });
        } else {
          this.dims.set(target, {
            intent: "enter",
            mode: "idle",
            style: detail.style,
          });
        }
        break;
    }
  }
}
