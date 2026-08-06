import { afterEach, beforeEach, expect, test, vi, type Mock } from "vitest";
import { GeometryEvents } from "../../geometry-events.mjs";
import type { LitElement } from "lit";
import type { WidthHeight } from "_controllers/geometry/geometry-style.types.mjs";
import type { EmitModes } from "../../geometry-events.types.mjs";

const { emitUpdate, emitLeave, emitMode } = vi.hoisted(() => ({
  emitUpdate: vi.fn(),
  emitLeave: vi.fn(),
  emitMode: vi.fn(),
}));

vi.mock("../../utils/geometry-event-utils.mjs", () => ({
  GeometryEventUtils: class {
    static emitUpdate = emitUpdate;
    static emitLeave = emitLeave;
    static emitMode = emitMode;
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let events: GeometryEvents<any>;
const host = vi.fn() as unknown as LitElement;

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
  const dims: WidthHeight = {
    width: 7,
    height: 11,
  };
  events.emit("update", dims);
  expect(emitUpdate).toHaveBeenCalledTimes(1);
  expect(emitLeave).toHaveBeenCalledTimes(0);
  expect(emitMode).toHaveBeenCalledTimes(0);
  expect(emitUpdate).toHaveBeenCalledWith(host, dims);
});

test("update no params", () => {
  expect(() => events.emit("update")).toThrow();
});

test("leave", () => {
  events.emit("leave");
  expect(emitUpdate).toHaveBeenCalledTimes(0);
  expect(emitLeave).toHaveBeenCalledTimes(1);
  expect(emitMode).toHaveBeenCalledTimes(0);
  expect(emitLeave).toHaveBeenCalledWith(host);
});

test("mode", () => {
  const mode: EmitModes = "hover-end";
  events.emit("mode", mode);
  expect(emitUpdate).toHaveBeenCalledTimes(0);
  expect(emitLeave).toHaveBeenCalledTimes(0);
  expect(emitMode).toHaveBeenCalledTimes(1);
  expect(emitMode).toHaveBeenCalledWith(host, mode);
});

test("mode no params", () => {
  expect(() => events.emit("mode")).toThrow();
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
