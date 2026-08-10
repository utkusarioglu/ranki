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
  ...Array.from({ length: 10 }, (_, i) => i * 10).map((dur) => ({
    block: {
      root: [
        {
          duration: dur,
          keyframes: [
            {
              height: 1,
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
                height: 1,
              },
            ],
            name: "h",
            options: {
              duration: dur,
            },
          },
        },
      ],
    },
    name: `root duration: ${dur}`,
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
