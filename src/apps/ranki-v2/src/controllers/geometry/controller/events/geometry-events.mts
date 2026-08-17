import type { R2C } from "_components/r2c/r2c.mjs";
import type { LitElement } from "lit";

import { assertExists } from "_error/assertions.mjs";

import type {
  GeometryEventCb,
  GeometryEventName,
  GeometryEventsConstructorParams,
} from "./types/geometry-events.constructor.types.mjs";
import type { GeometryEventTypes } from "./types/geometry-events.constructor.types.mjs";
import type { LocalAction } from "./types/geometry-events.types.mjs";
import type { GeometryEvent } from "./types/geometry-events.types.mjs";
import type { EventWithContext } from "./types/geometry-events.types.mjs";

import {
  ACTION_TIME_SEPARATOR,
  DEFAULT_EVENT_SETTINGS,
} from "./geometry-events.constants.mjs";
import { O11y } from "_controllers/geometry/o11y/o11y.mjs";
import { context } from "@opentelemetry/api";

export class GeometryEvents<Instance extends LitElement> {
  public static readonly GEOMETRY_EVENT_NAME = "r2-geometry";
  private readonly events: GeometryEventTypes;
  private readonly host: Instance;
  private readonly on: GeometryEventCb<Instance> | undefined;
  private readonly o11y: O11y<this>;

  constructor(params: GeometryEventsConstructorParams<Instance>) {
    this.host = params.host;
    this.events = {
      ...DEFAULT_EVENT_SETTINGS,
      ...params.events,
    };
    this.on = params.on;
    this.o11y = new O11y(this, {
      tracer: {
        nameFormat: ({ name }) => [this.host.tagName, name].join(":"),
      },
    });
  }

  deregisterListeners() {
    if (this.events.hover) {
      this.host.removeEventListener("pointerenter", this.onPointerEnter);
      this.host.removeEventListener("pointerleave", this.onPointerLeave);
    }
  }

  public emit(event: GeometryEvent) {
    this.o11y.trace.span("emit", ({ ctx }) => {
      const detail: EventWithContext<GeometryEvent> = {
        context: ctx,
        event,
      };
      const customEvent = new CustomEvent(GeometryEvents.GEOMETRY_EVENT_NAME, {
        bubbles: true,
        composed: true,
        detail,
      });
      this.host.dispatchEvent(customEvent);
    });
  }

  onActionsEnd(actions: LocalAction[]) {
    const onEvent = this.on;
    if (onEvent) {
      actions.forEach((action) => {
        onEvent(
          this.host,
          `${action}${ACTION_TIME_SEPARATOR}end` as GeometryEventName,
        );
      });
    }
  }

  onActionsStart(actions: LocalAction[]) {
    const onEvent = this.on;
    if (onEvent) {
      actions.forEach((action) => {
        onEvent(
          this.host,
          `${action}${ACTION_TIME_SEPARATOR}start` as GeometryEventName,
        );
      });
    }
  }

  public onEmit(callback: (target: R2C, detail: GeometryEvent) => void) {
    return async (e: CustomEvent<EventWithContext<GeometryEvent>>) => {
      e.stopPropagation();
      const target = e.composedPath()[0] as null | R2C;
      assertExists(target, { why: "No valid target given" });
      return context.with(e.detail.context, () =>
        callback(target, e.detail.event),
      );
    };
  }

  registerListeners() {
    if (this.events.hover) {
      this.host.addEventListener("pointerenter", this.onPointerEnter);
      this.host.addEventListener("pointerleave", this.onPointerLeave);
    }
  }

  private onPointerEnter = (e: PointerEvent) => {
    e.stopPropagation();
    this.emit({
      interaction: "hover.enter",
      type: "interaction",
    });
  };

  private onPointerLeave = (e: PointerEvent) => {
    e.stopPropagation();
    this.emit({ interaction: "hover.leave", type: "interaction" });
  };
}
