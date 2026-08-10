import type { LitElement } from "lit";

import type { LocalAction } from "../../geometry-intent.types.mjs";
import type {
  GeometryEventTypes,
  GeometryEvent,
} from "./geometry-events.types.mjs";
import type {
  GeometryEventCb,
  GeometryEventName,
  GeometryEventsConstructorParams,
} from "./geometry-events.constructor.types.mjs";

const DEFAULT_EVENT_SETTINGS: GeometryEventTypes = {
  hover: false,
};

export class GeometryEvents<Instance extends LitElement> {
  public static readonly GEOMETRY_EVENT_NAME = "r2-geometry";
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

  public emit(event: GeometryEvent) {
    this.host.dispatchEvent(
      new CustomEvent(GeometryEvents.GEOMETRY_EVENT_NAME, {
        bubbles: true,
        composed: true,
        detail: event,
      }),
    );
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
    this.emit({
      type: "mode",
      mode: "hover-start",
    });
  };

  private onPointerLeave = (e: PointerEvent) => {
    e.stopPropagation();
    this.emit({ type: "mode", mode: "hover-end" });
  };
}
