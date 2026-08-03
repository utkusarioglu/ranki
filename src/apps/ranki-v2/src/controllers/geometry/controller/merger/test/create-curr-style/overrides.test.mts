import { expect, test } from "vitest";
import { GeometryMerger } from "../../geometry-merger.mjs";
import type {
  InformContext,
  InformedChildStyle,
} from "../../../types/geometry-controller.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";

const context: InformContext = {
  index: 0,
  length: 1,
  stagger: 0,
};

const sizing: LayoutSizing = {
  container: {
    width: 11,
    height: 13,
  },
  set: [
    {
      intent: "enter",
      style: {
        width: 23,
        height: 19,
      },
    },
    {
      intent: "leave",
      style: {
        width: 43,
        height: 57,
      },
    },
  ],
};

const prev = null;

test("overridden self style", () => {
  const informed: InformedChildStyle = {
    context,
    containerExposed: {
      style: {
        // width: 7,
      },
    },
    selfOverrides: {
      style: {
        height: 3,
      },
    },
  };
  const response = GeometryMerger.createCurrStyle(informed, sizing, prev);
  const expected = {
    actions: ["enter"],
    container: {
      style: {
        width: 11,
        height: 13,
      },
    },
    context,
    self: {
      intent: "enter",
      style: {
        width: 23,
        height: 3,
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
        // width: 7,
      },
    },
    selfOverrides: {
      style: {
        height: 7,
      },
    },
  };
  const response = GeometryMerger.createCurrStyle(informed, sizing, prev);
  const expected = {
    actions: ["leave"],
    container: {
      style: {
        width: 11,
        height: 13,
      },
    },
    context,
    self: {
      intent: "leave",
      style: {
        width: 43,
        height: 7,
      },
    },
  };
  expect(response).toEqual(expected);
});
