import type { R2C } from "_components/r2c/r2c.mjs";

import { assertNotUndefined } from "_error/assertions.mjs";

import type { R2CNewChildSizeEvent } from "../../../events/geometry-events.types.mjs";
import type { EmittedComponentState } from "./children-registry.types.mjs";

export class ChildrenRegistry {
  private readonly dims = new WeakMap<R2C, EmittedComponentState>();

  public getOrdered(serial: R2C[]) {
    const ordered: EmittedComponentState[] = [];
    for (const component of serial) {
      const dims = this.dims.get(component);
      assertNotUndefined(dims, {
        why: "Element has no registered component dims",
        details: {
          tagName: component.tagName,
        },
      });
      ordered.push(dims);
    }
    return ordered;
  }

  /**
   * @dev
   * #1 This crates uncertainty about what properties exist in the object retrieved from the map
   */
  public update(target: R2C, detail: R2CNewChildSizeEvent) {
    switch (detail.intent) {
      case "disconnected":
        this.dims.delete(target);
        break;
      case "leave":
        this.dims.set(target, {
          mode: "idle",
          ...this.dims.get(target),
          intent: detail.intent,
        });
        break;
      case "update":
        if (this.dims.has(target)) {
          this.dims.set(target, {
            ...this.dims.get(target),
            intent: detail.intent,
            mode: detail.mode || "idle",
            style: detail.style,
            // ...detail.rect,
          });
        } else {
          this.dims.set(target, {
            intent: "enter",
            mode: "idle",
            style: detail.style,
          });
        }
        break;
      case "mode":
        this.dims.set(target, {
          intent: "enter",
          ...this.dims.get(target),
          mode: detail.mode,
        });
    }
  }
}
