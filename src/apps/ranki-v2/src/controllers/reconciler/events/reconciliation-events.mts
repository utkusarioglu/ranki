import type { LitElement } from "lit";

import { assertTrue } from "_error/assertions.mjs";

import type { R2ReconcilerEmit } from "./reconciliation-events.types.mjs";
import type { OnEmitCallback } from "./reconciliation-events.types.mjs";

export class ReconciliationEvents<Instance extends LitElement> {
  static leaveEventName = "r2-reconciler";
  private host: Instance;

  constructor(host: Instance) {
    this.host = host;
  }

  public static emit<Instance extends LitElement>(
    host: Instance,
    type: "leave",
  ) {
    assertTrue(type === "leave", {
      details: { type },
      why: "Only supported event is leave for now",
    });
    host.dispatchEvent(ReconciliationEvents.leaveEvent());
  }

  private static leaveEvent() {
    const detail = {
      type: "leave" as const,
    };
    return new CustomEvent<R2ReconcilerEmit>(this.leaveEventName, {
      bubbles: true,
      composed: true,
      detail,
    });
  }

  emit(type: "leave") {
    ReconciliationEvents.emit(this.host, type);
  }

  onEmit(cb: OnEmitCallback) {
    return (e: CustomEvent<R2ReconcilerEmit>) => {
      e.stopPropagation();
      const detail = e.detail;
      const target = e.composedPath()[0] as LitElement | null;
      return cb({ detail, target });
    };
  }
}
