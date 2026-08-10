import type {
  AnimationBlock,
  LayoutParsed,
} from "_controllers/geometry/controller/animator/animator.types.mjs";

import { expect, test } from "vitest";

import { LayoutParser } from "../../../layout-parser.mjs";

interface Case {
  block: AnimationBlock;
  expected: LayoutParsed;
  name: string;
}

const CASES: Case[] = [
  ...(
    [
      ["to.container.height", 11],
      ["to.self.height", 21],
    ] as [string, number][]
  ).map(([input, expected]) => ({
    block: {
      root: [
        {
          duration: 0,
          keyframes: [
            {
              height: input,
            },
          ],
          name: "h",
        },
      ],
    },
    expected: {
      root: [
        {
          apply: {
            keyframes: [
              {
                height: expected,
              },
            ],
            name: "h",
            options: {
              duration: 0,
            },
          },
        },
      ],
    },
    name: `root container: ${input}`,
  })),
];

CASES.forEach(({ block, expected, name }) => {
  test(name, () => {
    const response = LayoutParser.parse({
      recipe: block,
      curr: {
        actions: ["enter"],
        container: {
          style: {
            height: 11,
          },
        },
        context: {
          index: 0,
          length: 1,
          stagger: 0,
        },
        self: {
          lifecycle: "enter",
          interaction: {
            hover: "none",
            focus: "none",
            press: "none",
            drag: "none",
          },
          style: {
            height: 21,
            left: 0,
            top: 0,
            width: 0,
          },
        },
      },
      prev: null,
    });
    expect(response).toEqual(expected);
  });
});
