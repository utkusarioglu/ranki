import { expect, test } from "vitest";
import { LayoutUtils } from "../../layout-utils.mjs";
import type {
  LayoutGapsParams,
  LayoutSizing,
} from "../../layout-utils.types.mjs";
import type { ComponentDims } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";

test("zero size", () => {
  const gaps: LayoutGapsParams = { main: {}, cross: {} };
  const dims: ComponentDims[] = [
    {
      intent: "enter",
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
    ],
  };
  expect(response).toEqual(expected);
});

test("zero width", () => {
  const gaps: LayoutGapsParams = { main: {}, cross: {} };
  const dims: ComponentDims[] = [
    {
      intent: "enter",
      style: {
        width: 0,
        height: 3,
      },
    },
  ];
  const response = LayoutUtils.last(gaps)(dims);
  const expected: LayoutSizing = {
    container: {
      width: 0,
      height: 3,
    },
    set: [
      {
        intent: "enter",
        style: {
          width: 0,
          height: 3,
          top: 0,
          left: 0,
        },
      },
    ],
  };
  expect(response).toEqual(expected);
});

test("zero height", () => {
  const gaps: LayoutGapsParams = { main: {}, cross: {} };
  const dims: ComponentDims[] = [
    {
      intent: "enter",
      style: {
        width: 3,
        height: 0,
      },
    },
  ];
  const response = LayoutUtils.last(gaps)(dims);
  const expected: LayoutSizing = {
    container: {
      width: 3,
      height: 0,
    },
    set: [
      {
        intent: "enter",
        style: {
          width: 3,
          height: 0,
          top: 0,
          left: 0,
        },
      },
    ],
  };
  expect(response).toEqual(expected);
});

test("rectangle", () => {
  const gaps: LayoutGapsParams = { main: {}, cross: {} };
  const dims: ComponentDims[] = [
    {
      intent: "enter",
      style: {
        width: 3,
        height: 7,
      },
    },
  ];
  const response = LayoutUtils.last(gaps)(dims);
  const expected: LayoutSizing = {
    container: {
      width: 3,
      height: 7,
    },
    set: [
      {
        intent: "enter",
        style: {
          width: 3,
          height: 7,
          top: 0,
          left: 0,
        },
      },
    ],
  };
  expect(response).toEqual(expected);
});
