import type { LayoutSizing } from "_controllers/geometry/controller/sets/children/layout/layout-utils.types.mjs";

import { expect, test } from "vitest";

import type {
  CurrentAppliedStyle,
  InformContext,
  InformedChildStyle,
} from "../../../types/geometry-controller.types.mjs";

import { GeometryMerger } from "../../geometry-merger.mjs";

const context: InformContext = {
  index: 0,
  length: 1,
  stagger: 0,
};

const sizing: LayoutSizing = {
  container: {
    height: 130,
    width: 110,
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
      style: {
        height: 57,
        left: 121,
        top: 71,
        width: 43,
      },
    },
  ],
};

test("empty informed", () => {
  const informed: InformedChildStyle = {
    containerExposed: { style: {} },
    context,
    selfOverrides: {
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "enter",
      style: {},
    },
  };
  const response = GeometryMerger.createCurrStyle(informed, sizing);
  const expected: CurrentAppliedStyle = {
    actions: ["enter"],
    container: {
      style: {},
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
      style: {
        height: 130,
        width: 110,
      },
    },
  };
  expect(response).toEqual(expected);
});

test("informed container width", () => {
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
      style: {},
    },
  };
  const response = GeometryMerger.createCurrStyle(informed, sizing);
  const expected: CurrentAppliedStyle = {
    actions: ["enter"],
    container: {
      style: {
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
      style: {
        height: 130,
        width: 110,
      },
    },
  };
  expect(response).toEqual(expected);
});

test("informed container width 2", () => {
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
        hover: "end",
        press: "none",
      },
      lifecycle: "update",
      style: {},
    },
  };
  const response = GeometryMerger.createCurrStyle(informed, sizing);
  const expected: CurrentAppliedStyle = {
    actions: ["update", "hover-end"],
    container: {
      style: {
        width: 7,
        // height: 13,
      },
    },
    context,
    self: {
      interaction: {
        drag: "none",
        focus: "none",
        hover: "end",
        press: "none",
      },
      lifecycle: "update",
      style: {
        height: 130,
        width: 110,
      },
    },
  };
  expect(response).toEqual(expected);
});
