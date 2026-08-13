import type { EmittedComponentState } from "_controllers/geometry/controller/sets/children/registry/children-registry.types.mjs";

import { expect, test } from "vitest";

import type {
  LayoutGapsParams,
  LayoutSizing,
} from "../../layout-utils.types.mjs";

import { LayoutUtils } from "../../layout-utils.mjs";

test("zero size", () => {
  const gaps: LayoutGapsParams = { cross: {}, main: {} };
  const dims: EmittedComponentState[] = [
    {
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "enter",
      mode: "default",
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
        interaction: {
          drag: "none",
          focus: "none",
          hover: "none",
          press: "none",
        },
        lifecycle: "enter",
        mode: "default",
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

test("zero width", () => {
  const gaps: LayoutGapsParams = { cross: {}, main: {} };
  const dims: EmittedComponentState[] = [
    {
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "enter",
      mode: "default",
      style: {
        height: 3,
        width: 0,
      },
    },
  ];
  const response = LayoutUtils.last(gaps)(dims);
  const expected: LayoutSizing = {
    container: {
      height: 3,
      width: 0,
    },
    set: [
      {
        interaction: {
          drag: "none",
          focus: "none",
          hover: "none",
          press: "none",
        },
        lifecycle: "enter",
        mode: "default",
        style: {
          height: 3,
          left: 0,
          top: 0,
          width: 0,
        },
      },
    ],
  };
  expect(response).toEqual(expected);
});

test("zero height", () => {
  const gaps: LayoutGapsParams = { cross: {}, main: {} };
  const dims: EmittedComponentState[] = [
    {
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "enter",
      mode: "default",
      style: {
        height: 0,
        width: 3,
      },
    },
  ];
  const response = LayoutUtils.last(gaps)(dims);
  const expected: LayoutSizing = {
    container: {
      height: 0,
      width: 3,
    },
    set: [
      {
        interaction: {
          drag: "none",
          focus: "none",
          hover: "none",
          press: "none",
        },
        lifecycle: "enter",
        mode: "default",
        style: {
          height: 0,
          left: 0,
          top: 0,
          width: 3,
        },
      },
    ],
  };
  expect(response).toEqual(expected);
});

test("rectangle", () => {
  const gaps: LayoutGapsParams = { cross: {}, main: {} };
  const dims: EmittedComponentState[] = [
    {
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "enter",
      mode: "default",
      style: {
        height: 7,
        width: 3,
      },
    },
  ];
  const response = LayoutUtils.last(gaps)(dims);
  const expected: LayoutSizing = {
    container: {
      height: 7,
      width: 3,
    },
    set: [
      {
        interaction: {
          drag: "none",
          focus: "none",
          hover: "none",
          press: "none",
        },
        lifecycle: "enter",
        mode: "default",
        style: {
          height: 7,
          left: 0,
          top: 0,
          width: 3,
        },
      },
    ],
  };
  expect(response).toEqual(expected);
});
