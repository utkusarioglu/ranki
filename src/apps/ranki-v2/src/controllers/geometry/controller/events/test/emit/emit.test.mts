import type { WidthHeight } from "_controllers/geometry/geometry-style.types.mjs";
import type { LitElement } from "lit";

import { afterEach, beforeEach, expect, type Mock, test, vi } from "vitest";

import type { EmitModes } from "../../geometry-events.types.mjs";

import { GeometryEvents } from "../../geometry-events.mjs";

const { emitLeave, emitMode, emitUpdate, dispatchEvent } = vi.hoisted(() => ({
  emitLeave: vi.fn(),
  emitMode: vi.fn(),
  emitUpdate: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// vi.mock("../../utils/geometry-event-utils.mjs", () => ({
//   GeometryEventUtils: class {
//     static emitLeave = emitLeave;
//     static emitMode = emitMode;
//     static emitUpdate = emitUpdate;
//   },
// }));

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
  [emitUpdate, emitLeave, emitMode, host].forEach((f) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (f as Mock<any>).mockClear(),
  );
});

test("update", () => {
  const style: WidthHeight = {
    height: 11,
    width: 7,
  };
  events.emit({ type: "intent", intent: "update", style });
  expect(emitUpdate).toHaveBeenCalledTimes(1);
  expect(emitLeave).toHaveBeenCalledTimes(0);
  expect(emitMode).toHaveBeenCalledTimes(0);
  expect(emitUpdate).toHaveBeenCalledWith(host, style);
});

test("update no params", () => {
  expect(() =>
    events.emit(
      // @ts-expect-error Deliberately misshaped
      { type: "intent", intent: "update" },
    ),
  ).toThrow();
});

test("leave", () => {
  events.emit({ type: "intent", intent: "leave" });
  expect(emitUpdate).toHaveBeenCalledTimes(0);
  expect(emitLeave).toHaveBeenCalledTimes(1);
  expect(emitMode).toHaveBeenCalledTimes(0);
  expect(emitLeave).toHaveBeenCalledWith(host);
});

test("mode", () => {
  const mode: EmitModes = "hover-end";
  events.emit({ type: "mode", mode });
  expect(emitUpdate).toHaveBeenCalledTimes(0);
  expect(emitLeave).toHaveBeenCalledTimes(0);
  expect(emitMode).toHaveBeenCalledTimes(1);
  expect(emitMode).toHaveBeenCalledWith(host, mode);
});

test("mode no params", () => {
  expect(() =>
    events.emit(
      // @ts-expect-error deliberately misshaped
      { type: "mode" },
    ),
  ).toThrow();
});

/**
 * @dev
 * #1 Deliberately wrong data type
 */
test("bad intent", () => {
  expect(() =>
    events.emit(
      // @ts-expect-error #1
      "bad",
    ),
  ).toThrow();
});
