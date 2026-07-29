import { expect, test } from "vitest";
import { LayoutParser } from "../../layout-parser.mts";
import type { InformedChildStyle } from "../../../controller/geometry-controller.types.mts";
import type { AnimatableStylesConfigKeyframes } from "../../../animator/animator.types.mts";

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
        const blocks = [prop.toUpperCase(), `CONTAINER_${prop.toUpperCase()}`];
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
    const curr: InformedChildStyle = {
      container: {
        intent: "enter",
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
      [prop]: block,
    };
    const response = LayoutParser.evalKeyframe(curr, prev, blockObj);
    const expectedObj = {
      [prop]: block.startsWith("CONTAINER_") ? container : item,
    };

    expect(response).toEqual(expectedObj);
  });
}
