import type { LitElement } from "lit";

import { beforeEach, expect, test, vi } from "vitest";

import type { LocalAction } from "../../types/geometry-events.types.mjs";

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
  const actions: LocalAction[] = ["lifecycle.enter", "lifecycle.leave"];
  events.onActionsStart(actions);
  expect(on).toHaveBeenCalledTimes(2);
  expect(on).toHaveBeenNthCalledWith(1, host, "lifecycle.enter/start");
  expect(on).toHaveBeenNthCalledWith(2, host, "lifecycle.leave/start");
});

test("actionEnd", () => {
  const actions: LocalAction[] = ["lifecycle.enter", "lifecycle.leave"];
  events.onActionsEnd(actions);
  expect(on).toHaveBeenCalledTimes(2);
  expect(on).toHaveBeenNthCalledWith(1, host, "lifecycle.enter/end");
  expect(on).toHaveBeenNthCalledWith(2, host, "lifecycle.leave/end");
});
