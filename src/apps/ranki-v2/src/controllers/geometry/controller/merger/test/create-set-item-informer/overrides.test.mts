import type { LayoutSizing } from "_controllers/geometry/controller/sets/children/layout/layout-utils.types.mjs";

import { expect, test } from "vitest";

import type { InformSetProps } from "../../../animator/animator.types.mjs";
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
      lifecycle: "enter",
      interaction: "idle",
      style: {
        opacity: 0.44,
      },
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
        lifecycle: "enter",
        interaction: "idle",
        style: {
          height: 51,
          left: 0,
          top: 0,
          width: 41,
        },
      },
      {
        lifecycle: "leave",
        interaction: "idle",
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
    props,
    sizing,
    index: 0,
  });
  const expected: InformedChildStyle = {
    containerExposed: {
      style: {
        height: 11,
        width: 31,
      },
    },
    context,
    selfOverrides: {
      lifecycle: "enter",
      interaction: "idle",
      style: {
        ...sizing.set[0].style,
        opacity: 0.44,
      },
    },
  };
  expect(response).toEqual(expected);
});
