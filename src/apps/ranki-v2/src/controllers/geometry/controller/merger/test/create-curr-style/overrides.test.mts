import type { LayoutSizing } from "_controllers/geometry/controller/sets/children/layout/layout-utils.types.mjs";

import { expect, test } from "vitest";

import type {
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
    height: 13,
    width: 119,
  },
  set: [
    {
      intent: "enter",
      mode: "idle",
      style: {
        height: 19,
        left: 447,
        top: 2,
        width: 23,
      },
    },
    {
      intent: "leave",
      mode: "idle",
      style: {
        height: 57,
        left: 19,
        top: 21,
        width: 43,
      },
    },
  ],
};

test("overridden self style", () => {
  const informed: InformedChildStyle = {
    containerExposed: {
      style: {
        width: 7,
      },
    },
    context,
    selfOverrides: {
      intent: "enter",
      mode: "idle",
      style: {
        height: 3,
      },
    },
  };
  const response = GeometryMerger.createCurrStyle(informed, sizing);
  const expected = {
    actions: ["enter"],
    container: {
      style: {
        width: 7,
        // height: 13,
        // width: 11,
      },
    },
    context,
    self: {
      intent: "enter",
      mode: "idle",
      style: {
        height: 3,
        width: 119,
        // height: 3,
        // left: 0,
        // top: 0,
        // width: 23,
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
        width: 17,
      },
    },
    context,
    selfOverrides: {
      intent: "enter",
      mode: "idle",
      style: {
        height: 7,
      },
    },
  };
  const response = GeometryMerger.createCurrStyle(informed, sizing);
  const expected = {
    actions: ["enter"],
    container: {
      style: {
        width: 17,
        // height: 13,
        // width: 11,
      },
    },
    context,
    self: {
      // intent: "leave",
      intent: sizing.set[0].intent,
      mode: sizing.set[0].mode,
      style: {
        // ...sizing.set[0].style,
        height: 7,
        width: 119,
        // left: 0,
        // top: 0,
        // width: 43,
      },
    },
  };
  expect(response).toEqual(expected);
});
