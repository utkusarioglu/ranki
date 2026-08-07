import { expect, test } from "vitest";
import { LayoutUtils } from "../../layout-utils.mjs";
import type {
  LayoutGapsParams,
  LayoutSizing,
} from "../../layout-utils.types.mjs";
import type { EmittedComponentState } from "_controllers/geometry/controller/sets/children/registry/children-registr.types.mjs";

test("only last has size", () => {
  const gaps: LayoutGapsParams = { main: {}, cross: {} };
  const dims: EmittedComponentState[] = [
    {
      intent: "update",
      mode: "idle",
      style: {
        width: 0,
        height: 0,
      },
    },
    {
      intent: "enter",
      mode: "idle",
      style: {
        width: 17,
        height: 23,
      },
    },
  ];
  const response = LayoutUtils.last(gaps)(dims);
  const expected: LayoutSizing = {
    container: {
      width: 17,
      height: 23,
    },
    set: [
      {
        intent: "update",
        style: {
          width: 0,
          height: 0,
          top: 0,
          left: 0,
        },
      },
      {
        intent: "enter",
        style: {
          width: 17,
          height: 23,
          top: 0,
          left: 0,
        },
      },
    ],
  };
  expect(response).toEqual(expected);
});

test("last doesn't have size", () => {
  const gaps: LayoutGapsParams = { main: {}, cross: {} };
  const dims: EmittedComponentState[] = [
    {
      intent: "enter",
      mode: "idle",
      style: {
        width: 17,
        height: 23,
      },
    },
    {
      intent: "update",
      mode: "idle",
      style: {
        width: 0,
        height: 0,
      },
    },
  ];
  const response = LayoutUtils.last(gaps)(dims);
  const expected: LayoutSizing = {
    container: {
      width: 0,
      height: 0,
    },
    set: [
      {
        intent: "enter",
        style: {
          width: 0,
          height: 0,
          top: 0,
          left: 0,
        },
      },
      {
        intent: "update",
        style: {
          width: 0,
          height: 0,
          top: 0,
          left: 0,
        },
      },
    ],
  };
  expect(response).toEqual(expected);
});
