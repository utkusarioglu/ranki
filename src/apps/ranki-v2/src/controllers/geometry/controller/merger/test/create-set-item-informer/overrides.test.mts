import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";

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
      style: {
        opacity: 0.44,
      },
    },
    setName: "f",
  };
  const sizing: LayoutSizing = {
    container: {
      height: 21,
      width: 31,
    },
    set: [
      {
        intent: "enter",
        style: {
          height: 51,
          width: 41,
          top: 0,
          left: 0,
        },
      },
      {
        intent: "leave",
        style: {
          height: 91,
          width: 71,
          top: 0,
          left: 0,
        },
      },
    ],
  };
  const response = GeometryMerger.createSetItemInformer({
    context,
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
    selfOverrides: {
      style: {
        opacity: 0.44,
      },
    },
  };
  expect(response).toEqual(expected);
});
