import type { R2C } from "_components/r2c/r2c.mjs";

import type {
  GeometryEvent,
  GeometryEventLifecycle,
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
          lifecycle: "none",
          interaction: "idle",
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
  public update(target: R2C, detail: GeometryEvent) {
    switch (detail.type) {
      case "lifecycle":
        return this.updateIntent(target, detail);
      case "interaction":
        this.dims.set(target, {
          lifecycle: "enter",
          ...this.dims.get(target),
          interaction: detail.interaction,
        });
        break;

      default:
        assertNever({
          why: "Unknown update type",
          details: { detail, tagName: target.tagName },
        });
    }
  }

  private updateIntent(target: R2C, detail: GeometryEventLifecycle) {
    switch (detail.lifecycle) {
      case "disconnected":
        this.dims.delete(target);
        break;
      case "leave":
        this.dims.set(target, {
          // interaction: "idle",
          ...this.dims.get(target),
          interaction: detail.interaction || "idle",
          lifecycle: detail.lifecycle,
        });
        break;
      case "update":
        if (this.dims.has(target)) {
          this.dims.set(target, {
            lifecycle: detail.lifecycle,
            interaction: detail.interaction || "idle",
            style: detail.style,
          });
        } else {
          this.dims.set(target, {
            lifecycle: "enter",
            interaction: "idle",
            style: detail.style,
          });
        }
        break;
    }
  }
}
