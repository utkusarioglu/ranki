import { expect, test } from "vitest";
import { GeometryMerger } from "../../geometry-merger.mjs";
import type {
  InformContext,
  InformedChildStyle,
} from "../../../types/geometry-controller.types.mjs";
import type { InformSetProps } from "../../../animator/animator.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";

test("", () => {
  const context: InformContext = {
    index: 0,
    length: 1,
    stagger: 0,
  };
  const props: InformSetProps = {
    setName: "f",
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
          width: 41,
          height: 51,
        },
      },
      {
        intent: "leave",
        style: {
          width: 71,
          height: 91,
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
    context,
    containerExposed: {
      style: {
        height: 11,
        width: 31,
      },
    },
    selfOverrides: {
      style: {
        opacity: 0.44,
      },
    },
  };
  expect(response).toEqual(expected);
});
