import { expect, test } from "vitest";
import { LayoutParser } from "../../../layout-parser.mts";
import type {
  AnimationBlock,
  LayoutParsed,
} from "_controllers/geometry/animator/animator.types.mjs";

interface Case {
  name: string;
  block: AnimationBlock;
  expected: LayoutParsed;
}

const CASES: Case[] = [
  ...Array.from({ length: 10 }, (_, i) => i * 10).map((w) => ({
    name: `root then: ${w}`,
    block: {
      root: [
        {
          name: "h",
          duration: 0,
          keyframes: [
            {
              height: 1,
            },
          ],
          then: {
            root: [
              {
                name: "w",
                duration: 2,
                keyframes: [
                  {
                    width: "WIDTH",
                  },
                ],
              },
            ],
          },
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
              duration: 0,
            },
          },
          then: {
            root: [
              {
                apply: {
                  name: "w",
                  keyframes: [
                    {
                      width: 21,
                    },
                  ],
                  options: {
                    duration: 2,
                  },
                },
              },
            ],
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
        context: {
          index: 0,
          length: 1,
          stagger: 0,
        },
        container: {
          intent: "enter",
          style: {
            width: 11,
          },
        },
        item: {
          intent: "enter",
          style: {
            width: 21,
          },
        },
      },
      prev: null,
      block,
    });
    expect(response).toEqual(expected);
  });
});
