import type { R2C } from "_components/r2c/r2c.mjs";
import type { R2CNewChildSizeEvent } from "_controllers/geometry/controller/events/geometry-events.types.mjs";

// @vitest-environment jsdom
import { afterEach, beforeEach, expect, type Mock, test, vi } from "vitest";

import type { EmittedComponentState } from "../children-registry.types.mjs";

import { ChildrenRegistry } from "../children-registry.mjs";

const target = vi.fn() as unknown as R2C;

let registry: ChildrenRegistry;

let set: Mock<InstanceType<typeof WeakMap>["set"]>;
let get: Mock<InstanceType<typeof WeakMap>["get"]>;
let has: Mock<InstanceType<typeof WeakMap>["has"]>;
let del: Mock<InstanceType<typeof WeakMap>["delete"]>;

/**
 * @dev
 * #1 This access is normally private, so ts throws for these
 */
beforeEach(() => {
  registry = new ChildrenRegistry();
  set = vi.spyOn(
    // @ts-expect-error #1
    registry.dims,
    "set",
  ) as typeof set;

  get = vi.spyOn(
    // @ts-expect-error #1
    registry.dims,
    "get",
  ) as typeof get;

  has = vi.spyOn(
    // @ts-expect-error #1
    registry.dims,
    "has",
  ) as typeof has;

  del = vi.spyOn(
    // @ts-expect-error #1
    registry.dims,
    "delete",
  ) as typeof del;
});

afterEach(() => {
  [get, set, del, has].forEach((v) => v.mockClear());
});

test("disconnected", () => {
  const detail: R2CNewChildSizeEvent = {
    type: "intent",
    intent: "disconnected",
  };
  registry.update(target, detail);
  expect(del).toHaveBeenCalledTimes(1);
  expect(del).toHaveBeenNthCalledWith(1, target);
});

test("leave", () => {
  const detail: R2CNewChildSizeEvent = {
    type: "intent",
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

/**
 * @dev
 * #1 This access is normally private, so ts throws for these
 */
test("update", () => {
  const detail: R2CNewChildSizeEvent = {
    type: "intent",
    intent: "update",
    style: {
      height: 7,
      width: 5,
    },
  };
  const expected: EmittedComponentState = {
    intent: detail.intent,
    mode: "idle",
    style: detail.style,
  };
  // @ts-expect-error #1
  registry.dims
    //
    .set(target, {
      intent: "enter",
      mode: "idle",
      style: { height: 2, width: 1 },
    });
  set.mockClear();
  registry.update(target, detail);
  expect(has).toHaveBeenCalledTimes(1);
  expect(set).toHaveBeenCalledTimes(1);
  expect(set).toHaveBeenNthCalledWith(1, target, expected);
});

test("update intent registered as enter", () => {
  const detail: R2CNewChildSizeEvent = {
    type: "intent",
    intent: "update",
    style: {
      height: 7,
      width: 5,
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
    type: "mode",
    mode: "hover-start",
  };
  const expected: EmittedComponentState = {
    intent: "enter",
    mode: detail.mode,
  };
  registry.update(target, detail);
  expect(set).toHaveBeenCalledTimes(1);
  expect(set).toHaveBeenNthCalledWith(1, target, expected);
});
