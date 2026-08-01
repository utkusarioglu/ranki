import { expect, test } from "vitest";
import type { AnimatableStylesConfigKeyframes } from "../../../animator.types.mjs";
import type { CurrentAppliedStyle } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";
import { KeyframeParser } from "../keyframe-parser.mjs";

type K = keyof AnimatableStylesConfigKeyframes;

const CONTAINER_PROPS: K[] = [
  "top",
  "width",
  "height",
  "left",
  // "easing",
  // "offset",
  // "opacity",
  // "rotate",
  // "scale",
  // "skewX",
  // "skewY",
];

const ITEM_VALUES = Array.from({ length: 1 }, (_, i) => i * 10);
const CONTAINER_VALUES = Array.from({ length: 1 }, (_, i) => (i + 1) * 10);

function* testProduct(props: K[], values1: number[], values2: number[]) {
  for (let prop of props) {
    for (let item of values1) {
      for (let container of values2) {
        const blocks = [`to.self.${prop}`, `to.container.${prop}`];
        for (let block of blocks) {
          yield {
            prop,
            item,
            container,
            block,
          } as const;
        }
      }
    }
  }
}

for (let v of testProduct(CONTAINER_PROPS, ITEM_VALUES, CONTAINER_VALUES)) {
  const { prop, item, container, block } = v;

  test(`${prop}: ${block}`, () => {
    const curr: CurrentAppliedStyle = {
      actions: ["enter"],
      container: {
        style: {
          [prop]: container,
        },
      },
      self: {
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
    const prev: CurrentAppliedStyle | null = null;
    const blockObj: AnimatableStylesConfigKeyframes = {
      [prop]: block,
    };
    const response = KeyframeParser.evalKeyframe(curr, prev, blockObj);
    const expectedObj = {
      [prop]: block.startsWith("to.container.") ? container : item,
    };

    expect(response).toEqual(expectedObj);
  });
}
