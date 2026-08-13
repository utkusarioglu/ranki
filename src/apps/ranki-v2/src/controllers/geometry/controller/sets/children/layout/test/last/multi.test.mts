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
      mode: "default",
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "update",
      style: {
        height: 0,
        width: 0,
      },
    },
    {
      mode: "default",
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "enter",
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
        mode: "default",
        interaction: {
          drag: "none",
          focus: "none",
          hover: "none",
          press: "none",
        },
        lifecycle: "update",
        style: {
          height: 0,
          left: 0,
          top: 0,
          width: 0,
        },
      },
      {
        mode: "default",
        interaction: {
          drag: "none",
          focus: "none",
          hover: "none",
          press: "none",
        },
        lifecycle: "enter",
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
      mode: "default",
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "enter",
      style: {
        height: 23,
        width: 17,
      },
    },
    {
      mode: "default",
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "update",
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
        mode: "default",
        interaction: {
          drag: "none",
          focus: "none",
          hover: "none",
          press: "none",
        },
        lifecycle: "enter",
        style: {
          height: 0,
          left: 0,
          top: 0,
          width: 0,
        },
      },
      {
        mode: "default",
        interaction: {
          drag: "none",
          focus: "none",
          hover: "none",
          press: "none",
        },
        lifecycle: "update",
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
