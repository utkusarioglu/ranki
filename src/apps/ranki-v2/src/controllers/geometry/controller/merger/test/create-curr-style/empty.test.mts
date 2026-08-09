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
      intent: "enter",
      mode: "idle",
      style: {
        height: 19,
        left: 0,
        top: 0,
        width: 23,
      },
    },
    {
      intent: "leave",
      mode: "idle",
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
      intent: "enter",
      mode: "idle",
      style: {},
    },
  };
  const response = GeometryMerger.createCurrStyle(informed, sizing);
  const expected: CurrentAppliedStyle = {
    actions: ["enter", "idle"],
    container: {
      style: {},
    },
    context,
    self: {
      intent: "enter",
      mode: "idle",
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
    context,
    containerExposed: {
      style: {
        width: 7,
      },
    },
    selfOverrides: {
      intent: "enter",
      mode: "idle",
      style: {},
    },
  };
  const response = GeometryMerger.createCurrStyle(informed, sizing);
  const expected = {
    actions: ["enter", "idle"],
    container: {
      style: {
        width: 7,
      },
    },
    context,
    self: {
      intent: "enter",
      mode: "idle",
      style: {
        width: 110,
        height: 130,
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
    context,
    containerExposed: {
      style: {
        width: 7,
      },
    },
    selfOverrides: {
      intent: "update",
      mode: "hover-end",
      style: {},
    },
  };
  const response = GeometryMerger.createCurrStyle(informed, sizing);
  const expected = {
    actions: ["update", "hover-end"],
    container: {
      style: {
        width: 7,
        // height: 13,
      },
    },
    context,
    self: {
      intent: "update",
      mode: "hover-end",
      style: {
        width: 110,
        height: 130,
      },
    },
  };
  expect(response).toEqual(expected);
});
