import type { R2C } from "_components/r2c/r2c.mjs";
import type { GeometryEventInteraction } from "_controllers/geometry/controller/events/interaction.types.mjs";
import type { GeometryEventLifecycle } from "_controllers/geometry/controller/events/lifecycle.types.mjs";

import { assertNever } from "_error/assertions.mjs";

import type { GeometryEvent } from "../../../events/geometry-events.types.mjs";
import type {
  EmittedComponentState,
  GeometryInteraction,
} from "./children-registry.types.mjs";

export class ChildrenRegistry {
  private static DEFAULT_INTERACTION: GeometryInteraction = {
    drag: "none",
    focus: "none",
    hover: "none",
    press: "none",
  };
  private readonly dims = new WeakMap<R2C, EmittedComponentState>();

  public getOrdered(serial: R2C[]) {
    const ordered: EmittedComponentState[] = [];
    for (const component of serial) {
      const dims = this.dims.get(component);
      if (!dims) {
        ordered.push({
          interaction: {
            drag: "none",
            focus: "none",
            hover: "none",
            press: "none",
          },
          lifecycle: "none",
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
      case "interaction":
        this.updateInteraction(target, detail);
        break;
      case "lifecycle":
        this.updateLifecycle(target, detail);
        break;

      default:
        assertNever({
          details: { detail, tagName: target.tagName },
          why: "Unknown update type",
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
            interaction: {
              // ...ChildrenRegistry.DEFAULT_INTERACTION,
              ...curr?.interaction,
            },
            lifecycle: detail.lifecycle,
            // interaction: detail.interaction || "idle",
            style: detail.style,
          });
        } else {
          this.dims.set(target, {
            interaction: {
              ...ChildrenRegistry.DEFAULT_INTERACTION,
              // hover: "none",
              // drag: "none",
              // press: "none",
              // focus: "none",
            },
            lifecycle: "enter",
            style: detail.style,
          });
        }
        break;
    }
  }
}
