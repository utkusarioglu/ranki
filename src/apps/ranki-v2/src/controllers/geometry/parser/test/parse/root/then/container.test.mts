import { expect, test } from "vitest";
import { LayoutParser } from "../../../../layout-parser.mts";
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
  ...(
    [
      ["CONTAINER_HEIGHT", 11],
      ["HEIGHT", 21],
    ] as [string, number][]
  ).map(([input, expected]) => ({
    name: `root container: ${input}`,
    block: {
      root: [
        {
          name: "h",
          duration: 7,
          keyframes: [
            {
              height: 4,
              opacity: 1.1,
            },
          ],
          then: {
            root: [
              {
                name: "w",
                duration: 2,
                keyframes: [
                  {
                    width: input,
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
                height: 4,
                opacity: 1.1,
              },
            ],
            options: {
              duration: 7,
            },
          },
          then: {
            root: [
              {
                apply: {
                  name: "w",
                  keyframes: [
                    {
                      width: expected,
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
