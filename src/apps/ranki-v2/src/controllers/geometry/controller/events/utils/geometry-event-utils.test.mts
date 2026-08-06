import type { WidthHeight } from "_controllers/geometry/geometry-style.types.mjs";
import type { LitElement } from "lit";

import { afterEach, beforeEach, expect, test, vi } from "vitest";

import type { EmitModes } from "../geometry-events.types.mjs";

import { GeometryEventUtils } from "./geometry-event-utils.mjs";

const { dispatchEvent } = vi.hoisted(() => ({
  dispatchEvent: vi.fn(),
}));

const Host = vi.fn(
  class {
    dispatchEvent = dispatchEvent;
  },
);

let host: LitElement;

beforeEach(() => {
  host = new Host() as unknown as LitElement;
});

afterEach(() => {
  dispatchEvent.mockClear();
});

test("leave", () => {
  GeometryEventUtils.emitLeave(host);
  expect(dispatchEvent).toHaveBeenCalledOnce();
  const expected = { intent: "leave" };
  const detail = dispatchEvent.mock.calls[0][0].detail;
  expect(detail).toEqual(expected);
});

test("emitMode", () => {
  const mode: EmitModes = "hover-end";
  GeometryEventUtils.emitMode(host, mode);
  const expected = { intent: "mode", mode };
  const detail = dispatchEvent.mock.calls[0][0].detail;
  expect(detail).toEqual(expected);
});

test("emitUpdate", () => {
  const sizing: WidthHeight = {
    height: 11,
    width: 7,
  };
  GeometryEventUtils.emitUpdate(host, sizing);
  const expected = { intent: "update", style: sizing };
  const detail = dispatchEvent.mock.calls[0][0].detail;
  expect(detail).toEqual(expected);
});
