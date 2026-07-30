import { expect, test } from "vitest";
import { LayoutParser } from "../../../layout-parser.mjs";
import type {
  AnimationBlock,
  LayoutParsed,
} from "_controllers/geometry/controller/animator/animator.types.mjs";

interface Case {
  name: string;
  block: AnimationBlock;
  expected: LayoutParsed;
}

const CASES: Case[] = [
  ...(
    [
      ["CONTAINER_HEIGHT", 11],
      ["HEIGHT", 21],
    ] as [string, number][]
  ).map(([input, expected]) => ({
    name: `root container: ${input}`,
    block: {
      then: {
        root: [
          {
            name: "h",
            duration: 0,
            keyframes: [
              {
                height: input,
              },
            ],
          },
        ],
      },
    },
    expected: {
      then: {
        root: [
          {
            apply: {
              name: "h",
              keyframes: [
                {
                  height: expected,
                },
              ],
              options: {
                duration: 0,
              },
            },
          },
        ],
      },
    },
  })),
];

CASES.forEach(({ block, expected, name }) => {
  test(name, () => {
    const response = LayoutParser.parse({
      curr: {
        actions: ["enter"],
        context: {
          index: 0,
          length: 1,
          stagger: 0,
        },
        container: {
          style: {
            height: 11,
          },
        },
        item: {
          intent: "enter",
          style: {
            height: 21,
          },
        },
      },
      prev: null,
      block,
    });
    expect(response).toEqual(expected);
  });
});
