import { afterEach, beforeEach, expect, test, vi, type Mock } from "vitest";
import type { LitElement } from "lit";

const { emitMode, addEventListener, removeEventListener } = vi.hoisted(() => ({
  emitMode: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

import { GeometryEvents } from "../../geometry-events.mjs";

vi.mock("../../utils/geometry-event-utils.mjs", () => ({
  GeometryEventUtils: class {
    // static emitUpdate = emitUpdate;
    // static emitLeave = emitLeave;
    static emitMode = emitMode;
  },
}));

// let events: GeometryEvents<any>;
let host: LitElement;
const Host = vi.fn(
  class {
    addEventListener = addEventListener;
    removeEventListener = removeEventListener;
  },
);

beforeEach(() => {
  host = new Host() as unknown as LitElement;
});

afterEach(() => {
  [emitMode, addEventListener, removeEventListener, Host].forEach((f) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (f as Mock<any>).mockClear(),
  );
});

test("no events", () => {
  new GeometryEvents({ host }).registerListeners();
  expect(addEventListener).toHaveBeenCalledTimes(0);
});

test("hover event register", () => {
  new GeometryEvents({ host, events: { hover: true } }).registerListeners();
  expect(addEventListener).toHaveBeenCalledTimes(2);
});

test("hover event remove", () => {
  const events = new GeometryEvents({ host, events: { hover: true } });
  events.registerListeners();
  events.deregisterListeners();
  expect(addEventListener).toHaveBeenCalledTimes(2);
  expect(removeEventListener).toHaveBeenCalledTimes(2);
});
