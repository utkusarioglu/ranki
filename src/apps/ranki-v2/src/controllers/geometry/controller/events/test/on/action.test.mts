import type { LocalAction } from "../../geometry-events.types.mjs";
import type { LitElement } from "lit";

import { beforeEach, expect, test, vi } from "vitest";

import { GeometryEvents } from "../../geometry-events.mjs";

const on = vi.fn();
const Host = vi.fn(class {});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let events: GeometryEvents<any>;
let host: LitElement;

beforeEach(() => {
  host = new Host() as unknown as LitElement;
  events = new GeometryEvents({
    host,
    on,
  });
  on.mockClear();
});

test("actionStart", () => {
  const actions: LocalAction[] = ["enter", "leave"];
  events.onActionsStart(actions);
  expect(on).toHaveBeenCalledTimes(2);
  expect(on).toHaveBeenNthCalledWith(1, host, "enter-start");
  expect(on).toHaveBeenNthCalledWith(2, host, "leave-start");
  expect(true).toBe(true);
});

test("actionEnd", () => {
  const actions: LocalAction[] = ["enter", "leave"];
  events.onActionsEnd(actions);
  expect(on).toHaveBeenCalledTimes(2);
  expect(on).toHaveBeenNthCalledWith(1, host, "enter-end");
  expect(on).toHaveBeenNthCalledWith(2, host, "leave-end");
  expect(true).toBe(true);
});
