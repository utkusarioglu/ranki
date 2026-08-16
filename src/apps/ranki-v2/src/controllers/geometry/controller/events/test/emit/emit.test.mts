import type { WidthHeight } from "_controllers/geometry/controller/types/geometry-style.types.mjs";
import type { LitElement } from "lit";

import { afterEach, beforeEach, expect, type Mock, test, vi } from "vitest";

import type { GeometryEvent } from "../../types/geometry-events.types.mjs";
import type { GeometryInteractionEmit } from "../../types/interaction.types.mjs";

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
  events.emit(emit);
  const firstCall = dispatchEvent.mock.calls[0][0];
  expect(firstCall.type).toEqual(GeometryEvents.GEOMETRY_EVENT_NAME);
  expect(firstCall.detail.event).toEqual(emit);
});

test("leave", () => {
  const emit: GeometryEvent = { lifecycle: "leave", type: "lifecycle" };
  events.emit(emit);
  const firstCall = dispatchEvent.mock.calls[0][0];
  expect(firstCall.type).toEqual(GeometryEvents.GEOMETRY_EVENT_NAME);
  expect(firstCall.detail.event).toEqual(emit);
});

test("interaction", () => {
  const interaction: GeometryInteractionEmit = "hover.leave";
  const emit: GeometryEvent = { interaction, type: "interaction" };
  events.emit(emit);
  const firstCall = dispatchEvent.mock.calls[0][0];
  expect(firstCall.type).toEqual(GeometryEvents.GEOMETRY_EVENT_NAME);
  expect(firstCall.detail.event).toEqual(emit);
});
