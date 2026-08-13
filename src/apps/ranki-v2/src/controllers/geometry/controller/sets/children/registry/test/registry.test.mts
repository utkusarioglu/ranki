import type { R2C } from "_components/r2c/r2c.mjs";
import type { GeometryEvent } from "_controllers/geometry/controller/events/types/geometry-events.types.mjs";

// @vitest-environment jsdom
import { afterEach, beforeEach, expect, type Mock, test, vi } from "vitest";

import type { EmittedComponentState } from "../children-registry.types.mjs";

import { ChildrenRegistry } from "../children-registry.mjs";

const target = vi.fn() as unknown as R2C;

let registry: ChildrenRegistry;

let set: Mock<InstanceType<typeof WeakMap>["set"]>;
let get: Mock<InstanceType<typeof WeakMap>["get"]>;
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

  del = vi.spyOn(
    // @ts-expect-error #1
    registry.dims,
    "delete",
  ) as typeof del;
});

afterEach(() => {
  [get, set, del].forEach((v) => v.mockClear());
});

test("disconnected", () => {
  const detail: GeometryEvent = {
    lifecycle: "disconnected",
    type: "lifecycle",
  };
  registry.update(target, detail);
  expect(del).toHaveBeenCalledTimes(1);
  expect(del).toHaveBeenNthCalledWith(1, target);
});

test("leave", () => {
  const detail: GeometryEvent = {
    lifecycle: "leave",
    type: "lifecycle",
  };
  const expected: EmittedComponentState = {
    mode: "default",
    interaction: {
      drag: "none",
      focus: "none",
      hover: "none",
      press: "none",
    },
    lifecycle: "leave",
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
  const detail: GeometryEvent = {
    lifecycle: "update",
    style: {
      height: 7,
      width: 5,
    },
    type: "lifecycle",
  };
  const expected: EmittedComponentState = {
    mode: "default",
    interaction: {
      drag: "none",
      focus: "none",
      hover: "none",
      press: "none",
    },
    lifecycle: detail.lifecycle,
    style: detail.style,
  };
  // @ts-expect-error #1
  registry.dims
    //
    .set(target, {
      mode: "default",
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "enter",
      style: { height: 2, width: 1 },
    });
  set.mockClear();
  registry.update(target, detail);
  expect(set).toHaveBeenCalledTimes(1);
  expect(set).toHaveBeenNthCalledWith(1, target, expected);
});

test("update lifecycle registered as enter", () => {
  const detail: GeometryEvent = {
    lifecycle: "update",
    style: {
      height: 7,
      width: 5,
    },
    type: "lifecycle",
  };
  const expected: EmittedComponentState = {
    mode: "default",
    interaction: {
      drag: "none",
      focus: "none",
      hover: "none",
      press: "none",
    },
    lifecycle: "enter",
    style: detail.style,
  };
  registry.update(target, detail);
  expect(set).toHaveBeenCalledTimes(1);
  expect(set).toHaveBeenNthCalledWith(1, target, expected);
});

test("interaction", () => {
  const detail: GeometryEvent = {
    interaction: "hover.enter",
    type: "interaction",
  };
  const expected: EmittedComponentState = {
    mode: "default",
    interaction: {
      drag: "none",
      focus: "none",
      hover: "enter",
      press: "none",
    },
    lifecycle: "enter",
  };
  registry.update(target, detail);
  expect(set).toHaveBeenCalledTimes(1);
  expect(set).toHaveBeenNthCalledWith(1, target, expected);
});
