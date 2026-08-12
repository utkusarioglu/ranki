import type { LayoutSizing } from "_controllers/geometry/controller/sets/children/layout/layout-utils.types.mjs";

import { expect, test } from "vitest";

import type { InformSetProps } from "../../../animator/types/animator.types.mjs";
import type {
  InformContext,
  InformedChildStyle,
} from "../../../types/geometry-controller.types.mjs";

import { GeometryMerger } from "../../geometry-merger.mjs";

test("", () => {
  const context: InformContext = {
    index: 0,
    length: 1,
    stagger: 0,
  };
  const props: InformSetProps = {
    containerExposed: {
      style: {
        height: 11,
      },
    },
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
    setName: "one",
  };
  const sizing: LayoutSizing = {
    container: {
      height: 21,
      width: 31,
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
          height: 51,
          left: 0,
          top: 0,
          width: 41,
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
          height: 91,
          left: 0,
          top: 0,
          width: 71,
        },
      },
    ],
  };
  const response = GeometryMerger.createSetItemInformer({
    context,
    index: 0,
    props,
    sizing,
  });
  const expected: InformedChildStyle = {
    containerExposed: {
      style: {
        height: 11,
        width: 31,
      },
    },
    context,
    selfOverrides: sizing.set[0],
  };
  expect(response).toEqual(expected);
});
