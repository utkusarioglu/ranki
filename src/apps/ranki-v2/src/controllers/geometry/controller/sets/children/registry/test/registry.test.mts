// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi, type Mock } from "vitest";
import type { R2C } from "_components/r2c/r2c.mjs";
import type { R2CNewChildSizeEvent } from "_controllers/geometry/controller/events/geometry-events.types.mjs";
import { ChildrenRegistry } from "../children-registry.mjs";
import type { EmittedComponentState } from "../children-registr.types.mjs";

const target = vi.fn() as unknown as R2C;

let registry: ChildrenRegistry;

let set: Mock<InstanceType<typeof WeakMap>["set"]>;
let get: Mock<InstanceType<typeof WeakMap>["get"]>;
let has: Mock<InstanceType<typeof WeakMap>["has"]>;
let del: Mock<InstanceType<typeof WeakMap>["delete"]>;

beforeEach(() => {
  registry = new ChildrenRegistry();
  set = vi.spyOn(
    // @ts-expect-error
    registry.dims,
    "set",
  ) as typeof set;

  get = vi.spyOn(
    // @ts-expect-error
    registry.dims,
    "get",
  ) as typeof get;

  has = vi.spyOn(
    // @ts-expect-error
    registry.dims,
    "has",
  ) as typeof has;

  del = vi.spyOn(
    // @ts-expect-error
    registry.dims,
    "delete",
  ) as typeof del;
});

afterEach(() => {
  [get, set, del, has].forEach((v) => v.mockClear());
});

test("disconnected", () => {
  const detail: R2CNewChildSizeEvent = {
    intent: "disconnected",
  };
  registry.update(target, detail);
  expect(del).toHaveBeenCalledTimes(1);
  expect(del).toHaveBeenNthCalledWith(1, target);
});

test("leave", () => {
  const detail: R2CNewChildSizeEvent = {
    intent: "leave",
  };
  const expected: EmittedComponentState = {
    intent: "leave",
    mode: "idle",
  };
  registry.update(target, detail);
  expect(set).toHaveBeenCalledTimes(1);
  expect(set).toHaveBeenNthCalledWith(1, target, expected);
});

test("update", () => {
  const detail: R2CNewChildSizeEvent = {
    intent: "update",
    style: {
      width: 5,
      height: 7,
    },
  };
  const expected: EmittedComponentState = {
    ...detail,
    mode: "idle",
  };
  // @ts-expect-error
  registry.dims.set(target, {
    intent: "enter",
    mode: "idle",
    style: { width: 1, height: 2 },
  });
  set.mockClear();
  registry.update(target, detail);
  expect(has).toHaveBeenCalledTimes(1);
  expect(set).toHaveBeenCalledTimes(1);
  expect(set).toHaveBeenNthCalledWith(1, target, expected);
});

test("update intent registered as enter", () => {
  const detail: R2CNewChildSizeEvent = {
    intent: "update",
    style: {
      width: 5,
      height: 7,
    },
  };
  const expected: EmittedComponentState = {
    intent: "enter",
    mode: "idle",
    style: detail.style,
  };
  registry.update(target, detail);
  expect(set).toHaveBeenCalledTimes(1);
  expect(set).toHaveBeenNthCalledWith(1, target, expected);
});

test("mode", () => {
  const detail: R2CNewChildSizeEvent = {
    intent: "mode",
    mode: "hover-start",
  };
  const expected: EmittedComponentState = {
    mode: detail.mode,
    intent: "enter",
  };
  registry.update(target, detail);
  expect(set).toHaveBeenCalledTimes(1);
  expect(set).toHaveBeenNthCalledWith(1, target, expected);
});
