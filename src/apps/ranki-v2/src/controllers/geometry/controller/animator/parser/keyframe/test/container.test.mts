import type { CurrentAppliedStyle } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";

import { expect, test } from "vitest";

import type { AnimatableStylesConfigKeyframes } from "../../../types/animator.types.mjs";

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
  for (const prop of props) {
    for (const item of values1) {
      for (const container of values2) {
        const blocks = [` = to.self.${prop}`, `= to.container.${prop}`];
        for (const block of blocks) {
          yield {
            block,
            container,
            item,
            prop,
          } as const;
        }
      }
    }
  }
}

for (const v of testProduct(CONTAINER_PROPS, ITEM_VALUES, CONTAINER_VALUES)) {
  const { block, container, item, prop } = v;

  test(`${prop}: ${block}`, () => {
    const curr: CurrentAppliedStyle = {
      actions: ["enter"],
      container: {
        style: {
          [prop]: container,
        },
      },
      context: {
        index: 0,
        length: 1,
        stagger: 0,
      },
      self: {
        interaction: {
          drag: "none",
          focus: "none",
          hover: "none",
          press: "none",
        },
        lifecycle: "enter",
        style: {
          [prop]: item,
        },
      },
    };
    const prev: CurrentAppliedStyle | null = null;
    const blockObj: AnimatableStylesConfigKeyframes = {
      [prop]: block,
    };
    const response = KeyframeParser.evalKeyframe(curr, prev, blockObj);
    const expectedObj = {
      [prop]: block.includes("to.container.") ? container : item,
    };

    expect(response).toEqual(expectedObj);
  });
}
