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
  ...Array.from({ length: 10 }, (_, i) => i * 10).map((dur) => ({
    name: `root duration: ${dur}`,
    block: {
      root: [
        {
          name: "h",
          duration: dur,
          keyframes: [
            {
              height: 1,
            },
          ],
        },
      ],
    },
    expected: {
      root: [
        {
          apply: {
            name: "h",
            keyframes: [
              {
                height: 1,
              },
            ],
            options: {
              duration: dur,
            },
          },
        },
      ],
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
        self: {
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
