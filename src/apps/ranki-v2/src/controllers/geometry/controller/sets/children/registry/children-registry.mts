import type { R2C } from "_components/r2c/r2c.mjs";

import type {
  GeometryEvent,
  GeometryEventInteraction,
  GeometryEventLifecycle,
} from "../../../events/geometry-events.types.mjs";
import type {
  EmittedComponentState,
  GeometryInteraction,
} from "./children-registry.types.mjs";
import { assertNever } from "_error/assertions.mjs";

export class ChildrenRegistry {
  private static DEFAULT_INTERACTION: GeometryInteraction = {
    hover: "none",
    drag: "none",
    focus: "none",
    press: "none",
  };
  private readonly dims = new WeakMap<R2C, EmittedComponentState>();

  public getOrdered(serial: R2C[]) {
    const ordered: EmittedComponentState[] = [];
    for (const component of serial) {
      const dims = this.dims.get(component);
      if (!dims) {
        ordered.push({
          lifecycle: "none",
          interaction: {
            hover: "none",
            drag: "none",
            press: "none",
            focus: "none",
          },
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
        this.updateLifecycle(target, detail);
        break;
      case "interaction":
        this.updateInteraction(target, detail);
        break;

      default:
        assertNever({
          why: "Unknown update type",
          details: { detail, tagName: target.tagName },
        });
    }
  }

  private updateInteraction(target: R2C, detail: GeometryEventInteraction) {
    const curr = this.dims.get(target);

    this.dims.set(target, {
      lifecycle: "enter",
      ...curr,
      interaction: {
        ...ChildrenRegistry.DEFAULT_INTERACTION,
        ...curr?.interaction,
        ...Object.fromEntries([detail.interaction.split("-")]),
      },
    });
  }

  private updateLifecycle(target: R2C, detail: GeometryEventLifecycle) {
    const curr = this.dims.get(target);
    switch (detail.lifecycle) {
      case "disconnected":
        this.dims.delete(target);
        break;
      case "leave":
        this.dims.set(target, {
          // interaction: "idle",
          ...curr,
          // ...this.dims.get(target),
          interaction: {
            ...ChildrenRegistry.DEFAULT_INTERACTION,
            ...curr?.interaction,
            // ...detail.interaction
          },
          lifecycle: detail.lifecycle,
        });
        break;
      case "update":
        if (curr) {
          this.dims.set(target, {
            lifecycle: detail.lifecycle,
            interaction: {
              // ...ChildrenRegistry.DEFAULT_INTERACTION,
              ...curr?.interaction,
            },
            // interaction: detail.interaction || "idle",
            style: detail.style,
          });
        } else {
          this.dims.set(target, {
            lifecycle: "enter",
            interaction: {
              ...ChildrenRegistry.DEFAULT_INTERACTION,
              // hover: "none",
              // drag: "none",
              // press: "none",
              // focus: "none",
            },
            style: detail.style,
          });
        }
        break;
    }
  }
}
