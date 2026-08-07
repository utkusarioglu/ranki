import type { EmittedComponentState } from "_controllers/geometry/controller/sets/children/registry/children-registry.types.mjs";

import { expect, test } from "vitest";

import type {
  LayoutGapsParams,
  LayoutSizing,
} from "../../layout-utils.types.mjs";

import { LayoutUtils } from "../../layout-utils.mjs";

test("only last has size", () => {
  const gaps: LayoutGapsParams = { cross: {}, main: {} };
  const dims: EmittedComponentState[] = [
    {
      intent: "update",
      mode: "idle",
      style: {
        height: 0,
        width: 0,
      },
    },
    {
      intent: "enter",
      mode: "idle",
      style: {
        height: 23,
        width: 17,
      },
    },
  ];
  const response = LayoutUtils.last(gaps)(dims);
  const expected: LayoutSizing = {
    container: {
      height: 23,
      width: 17,
    },
    set: [
      {
        intent: "update",
        style: {
          height: 0,
          left: 0,
          top: 0,
          width: 0,
        },
      },
      {
        intent: "enter",
        style: {
          height: 23,
          left: 0,
          top: 0,
          width: 17,
        },
      },
    ],
  };
  expect(response).toEqual(expected);
});

test("last doesn't have size", () => {
  const gaps: LayoutGapsParams = { cross: {}, main: {} };
  const dims: EmittedComponentState[] = [
    {
      intent: "enter",
      mode: "idle",
      style: {
        height: 23,
        width: 17,
      },
    },
    {
      intent: "update",
      mode: "idle",
      style: {
        height: 0,
        width: 0,
      },
    },
  ];
  const response = LayoutUtils.last(gaps)(dims);
  const expected: LayoutSizing = {
    container: {
      height: 0,
      width: 0,
    },
    set: [
      {
        intent: "enter",
        style: {
          height: 0,
          left: 0,
          top: 0,
          width: 0,
        },
      },
      {
        intent: "update",
        style: {
          height: 0,
          left: 0,
          top: 0,
          width: 0,
        },
      },
    ],
  };
  expect(response).toEqual(expected);
});
