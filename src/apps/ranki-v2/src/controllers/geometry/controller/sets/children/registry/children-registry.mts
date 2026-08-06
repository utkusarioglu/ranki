import type { R2C } from "_components/r2c/r2c.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";
import type { R2CNewChildSizeEvent } from "../../../events/geometry-events.types.mjs";
import type { ComponentDims } from "../../../types/geometry-controller.types.mjs";

export class ChildrenRegistry {
  private readonly dims = new WeakMap<R2C, ComponentDims>();

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
          intent: detail.intent,
          style: {
            height: 0,
            width: 0,
          },
        });
        break;
      case "update":
        if (this.dims.has(target)) {
          this.dims.set(target, {
            intent: detail.intent,
            style: detail.style,
            // ...detail.rect,
          });
        } else {
          this.dims.set(target, {
            intent: "enter",
            style: detail.style,
          });
        }
        break;
      case "mode":
        this.dims.set(
          target,
          // @ts-expect-error #1
          {
            ...this.dims.get(target),
            mode: detail.mode,
          },
        );
    }
  }

  public getOrdered(serial: R2C[]) {
    const ordered: ComponentDims[] = [];
    for (const component of serial) {
      const dims = this.dims.get(component);
      assertNotUndefined(dims, {
        why: "Element has no registered component dims",
      });
      ordered.push(dims);
    }
    return ordered;
  }
}
