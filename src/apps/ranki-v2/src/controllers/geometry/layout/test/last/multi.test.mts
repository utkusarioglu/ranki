import { expect, test } from "vitest";
import { LayoutUtils } from "../../layout-utils.mjs";
import type {
  LayoutGapsParams,
  LayoutSizing,
} from "../../layout-utils.types.mjs";
import type { ComponentDims } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";

test("only last has size", () => {
  const gaps: LayoutGapsParams = { main: {}, cross: {} };
  const dims: ComponentDims[] = [
    {
      intent: "update",
      style: {
        width: 0,
        height: 0,
      },
    },
    {
      intent: "enter",
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
  const dims: ComponentDims[] = [
    {
      intent: "enter",
      style: {
        width: 17,
        height: 23,
      },
    },
    {
      intent: "update",
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
