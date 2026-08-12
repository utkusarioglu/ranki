import type { WidthHeight } from "_controllers/geometry/controller/types/geometry-style.types.mjs";
import type { LitElement } from "lit";

import { afterEach, beforeEach, expect, type Mock, test, vi } from "vitest";

import type {
  GeometryEvent,
  GeometryInteractionEmit,
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
  const emit: GeometryEvent = {
    lifecycle: "update",
    style,
    type: "lifecycle",
  };
  const expected = new CustomEvent(GeometryEvents.GEOMETRY_EVENT_NAME, {
    detail: emit,
  });
  events.emit(emit);
  expect(dispatchEvent).toHaveBeenCalledWith(expected);
});

test("leave", () => {
  const emit: GeometryEvent = { lifecycle: "leave", type: "lifecycle" };
  events.emit(emit);
  const expected = new CustomEvent(GeometryEvents.GEOMETRY_EVENT_NAME, {
    detail: emit,
  });
  expect(dispatchEvent).toHaveBeenCalledWith(expected);
});

test("interaction", () => {
  const interaction: GeometryInteractionEmit = "hover-end";
  const emit: GeometryEvent = { interaction, type: "interaction" };
  events.emit(emit);
  const expected = new CustomEvent(GeometryEvents.GEOMETRY_EVENT_NAME, {
    detail: emit,
  });
  expect(dispatchEvent).toHaveBeenCalledWith(expected);
});
