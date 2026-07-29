import { expect, test } from "vitest";
import type { InformedChildStyle } from "_controllers/geometry/controller/geometry-controller.types.mjs";
import type { AnimatableStylesConfigKeyframes } from "../../../animator.types.mjs";
import { KeyframeParser } from "../keyframe-parser.mjs";

type K = keyof AnimatableStylesConfigKeyframes;

const CONTAINER_PROPS: K[] = ["top", "width", "height", "left"];

const ITEM_VALUES = Array.from({ length: 1 }, (_, i) => i * 10);
const CONTAINER_VALUES = Array.from({ length: 1 }, (_, i) => (i + 1) * 10);

function* testProduct(props: K[], values1: number[], values2: number[]) {
  for (let prop of props) {
    for (let item of values1) {
      for (let container of values2) {
        yield {
          prop,
          item,
          container,
        } as const;
      }
    }
  }
}

for (let v of testProduct(CONTAINER_PROPS, ITEM_VALUES, CONTAINER_VALUES)) {
  const { prop, item, container } = v;

  test(`${prop}`, () => {
    const curr: InformedChildStyle = {
      container: {
        style: {
          [prop]: container,
        },
      },
      item: {
        intent: "enter",
        style: {
          [prop]: item,
        },
      },
      context: {
        length: 1,
        index: 0,
        stagger: 0,
      },
    };
    const prev: InformedChildStyle | null = null;
    const blockObj: AnimatableStylesConfigKeyframes = {
      [prop]: prop.toUpperCase(),
    };
    const response = KeyframeParser.evalKeyframe(curr, prev, blockObj);
    const expectedObj = {
      [prop]: item,
    };

    expect(response).toEqual(expectedObj);
  });
}
