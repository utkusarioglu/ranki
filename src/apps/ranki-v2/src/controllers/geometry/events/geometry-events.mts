import type { LitElement } from "lit";
import type { EmitIntent, LocalAction } from "../geometry-intent.types.mts";
import type { WidthHeight } from "../geometry-style.types.mts";
import type { EmitModes } from "./geometry-events.types.mts";
import { assertNever, assertNotUndefined } from "_error/assertions.mjs";
import { GeometryEventUtils } from "./geometry-event-utils.mts";

export type GeometryEventName = `${LocalAction}-start` | `${LocalAction}-end`;

export type GeometryEventCb<Instance> = (
  s: Instance,
  event: GeometryEventName,
) => void;

export interface GeometryEventTypes {
  hover: boolean;
}

interface GeometryEventsConstructorParams<Instance extends LitElement> {
  host: Instance;
  events?: GeometryEventTypes;
  on?: GeometryEventCb<Instance>;
}

export class GeometryEvents<Instance extends LitElement> {
  private readonly host: Instance;
  private readonly events: GeometryEventTypes;
  private readonly on: GeometryEventCb<Instance> | undefined;

  constructor(params: GeometryEventsConstructorParams<Instance>) {
    this.host = params.host;
    this.events = {
      hover: false,
      ...params.events,
    };
    this.on = params.on;
  }

  registerListeners() {
    if (this.events.hover) {
      this.host.addEventListener("pointerenter", this.onPointerEnter);
      this.host.addEventListener("pointerleave", this.onPointerLeave);
    }
  }

  deregisterListeners() {
    if (this.events.hover) {
      this.host.removeEventListener("pointerenter", this.onPointerEnter);
      this.host.removeEventListener("pointerleave", this.onPointerLeave);
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

  onActionsStart(actions: LocalAction[]) {
    const onEvent = this.on;
    if (onEvent) {
      actions.forEach((action) => {
        onEvent(this.host, `${action}-start` as GeometryEventName);
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

  public emit(intent: EmitIntent, dims?: WidthHeight | EmitModes) {
    switch (intent) {
      case "update":
        assertNotUndefined(dims, {
          why: "Dims are required for emitting size",
        });
        GeometryEventUtils.emitUpdate(this.host, dims);
        break;
      case "leave":
        GeometryEventUtils.emitLeave(this.host);
        break;
      case "mode":
        assertNotUndefined(dims, {
          why: "Dims are required for emitting size",
        });
        GeometryEventUtils.emitMode(this.host, dims as unknown as EmitModes);
        break;
      default:
        assertNever({
          why: "Unrecognized emit intent",
          details: { intent, dims },
        });
    }
  }
}
