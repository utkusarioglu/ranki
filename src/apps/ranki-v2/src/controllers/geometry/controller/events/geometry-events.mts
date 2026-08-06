import type { LitElement } from "lit";

import { assertNever, assertNotUndefined } from "_error/assertions.mjs";

import type { EmitIntent, LocalAction } from "../../geometry-intent.types.mjs";
import type { WidthHeight } from "../../geometry-style.types.mjs";
import type {
  EmitModes,
  GeometryEventCb,
  GeometryEventName,
  GeometryEventsConstructorParams,
  GeometryEventTypes,
} from "./geometry-events.types.mjs";

import { GeometryEventUtils } from "./utils/geometry-event-utils.mjs";

const DEFAULT_EVENT_SETTINGS: GeometryEventTypes = {
  hover: false,
};

export class GeometryEvents<Instance extends LitElement> {
  private readonly events: GeometryEventTypes;
  private readonly host: Instance;
  private readonly on: GeometryEventCb<Instance> | undefined;

  constructor(params: GeometryEventsConstructorParams<Instance>) {
    this.host = params.host;
    this.events = {
      ...DEFAULT_EVENT_SETTINGS,
      ...params.events,
    };
    this.on = params.on;
  }

  deregisterListeners() {
    if (this.events.hover) {
      this.host.removeEventListener("pointerenter", this.onPointerEnter);
      this.host.removeEventListener("pointerleave", this.onPointerLeave);
    }
  }

  public emit(intent: EmitIntent, dims?: EmitModes | WidthHeight) {
    switch (intent) {
      case "leave":
        GeometryEventUtils.emitLeave(this.host);
        break;
      case "mode":
        assertNotUndefined(dims, {
          why: "Dims are required for emitting size",
        });
        GeometryEventUtils.emitMode(this.host, dims as unknown as EmitModes);
        break;
      case "update":
        assertNotUndefined(dims, {
          why: "Dims are required for emitting size",
        });
        GeometryEventUtils.emitUpdate(this.host, dims);
        break;
      default:
        assertNever({
          details: { dims, intent },
          why: "Unrecognized emit intent",
        });
    }
  }

  onActionsEnd(actions: LocalAction[]) {
    const onEvent = this.on;
    if (onEvent) {
      actions.forEach((action) => {
        onEvent(this.host, `${action}-end` as GeometryEventName);
      });
    }
  }

  onActionsStart(actions: LocalAction[]) {
    const onEvent = this.on;
    if (onEvent) {
      actions.forEach((action) => {
        onEvent(this.host, `${action}-start` as GeometryEventName);
      });
    }
  }

  registerListeners() {
    if (this.events.hover) {
      this.host.addEventListener("pointerenter", this.onPointerEnter);
      this.host.addEventListener("pointerleave", this.onPointerLeave);
    }
  }

  private onPointerEnter = (e: PointerEvent) => {
    e.stopPropagation();
    this.emit("mode", "hover-start");
  };

  private onPointerLeave = (e: PointerEvent) => {
    e.stopPropagation();
    this.emit("mode", "hover-end");
  };
}
