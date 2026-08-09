import type { WidthHeight } from "_controllers/geometry/geometry-style.types.mjs";
import type { LitElement } from "lit";

import { afterEach, beforeEach, expect, type Mock, test, vi } from "vitest";

import type {
  EmitModes,
  R2CNewChildSizeEvent,
} from "../../geometry-events.types.mjs";

import { GeometryEvents } from "../../geometry-events.mjs";

const { dispatchEvent } = vi.hoisted(() => ({
  dispatchEvent: vi.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let events: GeometryEvents<any>;
const Host = vi.fn(
  class {
    dispatchEvent = dispatchEvent;
  },
);
const host = new Host() as unknown as LitElement;

beforeEach(() => {
  events = new GeometryEvents({ host });
});

afterEach(() => {
  [dispatchEvent, Host].forEach((f) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (f as Mock<any>).mockClear(),
  );
});

test("update", () => {
  const style: WidthHeight = {
    height: 11,
    width: 7,
  };
  const emit: R2CNewChildSizeEvent = {
    type: "intent",
    intent: "update",
    style,
  };
  const expected = new CustomEvent(GeometryEvents.GEOMETRY_EVENT_NAME, {
    detail: emit,
  });
  events.emit(emit);
  expect(dispatchEvent).toHaveBeenCalledWith(expected);
});

test("leave", () => {
  const emit: R2CNewChildSizeEvent = { type: "intent", intent: "leave" };
  events.emit(emit);
  const expected = new CustomEvent(GeometryEvents.GEOMETRY_EVENT_NAME, {
    detail: emit,
  });
  expect(dispatchEvent).toHaveBeenCalledWith(expected);
});

test("mode", () => {
  const mode: EmitModes = "hover-end";
  const emit: R2CNewChildSizeEvent = { type: "mode", mode };
  events.emit(emit);
  const expected = new CustomEvent(GeometryEvents.GEOMETRY_EVENT_NAME, {
    detail: emit,
  });
  expect(dispatchEvent).toHaveBeenCalledWith(expected);
});
