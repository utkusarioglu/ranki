import type { LayoutSizing } from "_controllers/geometry/controller/sets/children/layout/layout-utils.types.mjs";

import { expect, test } from "vitest";

import type {
  CurrentAppliedStyle,
  InformContext,
  InformedChildStyle,
} from "../../../types/geometry-controller.types.mjs";

import { GeometryMerger } from "../../geometry-merger.mjs";

const sizing: LayoutSizing = {
  container: {
    height: 13,
    width: 11,
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
        height: 19,
        left: 0,
        top: 0,
        width: 23,
      },
    },
    {
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "leave",
      mode: "default",
      style: {
        height: 57,
        left: 0,
        top: 0,
        width: 43,
      },
    },
  ],
};

test("exposed container width", () => {
  const context: InformContext = {
    index: 0,
    length: 1,
    stagger: 0,
  };
  const informed: InformedChildStyle = {
    containerExposed: {
      style: {
        width: 7,
      },
    },
    context,
    selfOverrides: {
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "enter",
      mode: "default",
      style: {},
    },
  };
  const response = GeometryMerger.createCurrStyle(informed, sizing);
  const expected: CurrentAppliedStyle = {
    actions: ["lifecycle.enter"],
    container: {
      style: {
        // height: 13,
        width: 7,
      },
    },
    context,
    self: {
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "enter",
      mode: "default",
      style: {
        height: 13,
        width: 11,
        // height: 19,
        // left: 0,
        // top: 0,
        // width: 23,
      },
    },
  };
  expect(response).toEqual(expected);
});

test("exposed container width 2", () => {
  const context: InformContext = {
    index: 1,
    length: 2,
    stagger: 1,
  };
  const informed: InformedChildStyle = {
    containerExposed: {
      style: {
        width: 7,
      },
    },
    context,
    selfOverrides: {
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "leave",
      mode: "default",
      style: {},
    },
  };
  const response = GeometryMerger.createCurrStyle(informed, sizing);
  const expected: CurrentAppliedStyle = {
    actions: ["lifecycle.leave"],
    container: {
      style: {
        // height: 13,
        width: 7,
      },
    },
    context,
    self: {
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "leave",
      mode: "default",
      style: {
        height: 13,
        width: 11,
        // height: 57,
        // left: 0,
        // top: 0,
        // width: 43,
      },
    },
  };
  expect(response).toEqual(expected);
});
