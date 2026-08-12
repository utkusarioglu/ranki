import type {
  AnimationBlock,
  LayoutParsed,
} from "_controllers/geometry/controller/animator/animator.types.mjs";

import { expect, test } from "vitest";

import { LayoutParser } from "../../../../layout-parser.mjs";

interface Case {
  block: AnimationBlock;
  expected: LayoutParsed;
  name: string;
}

const CASES: Case[] = [
  ...(
    [
      [" = to.container.height", 11],
      ["= to.self.height", 21],
    ] as [string, number][]
  ).map(([input, expected]) => ({
    block: {
      root: [
        {
          duration: 7,
          keyframes: [
            {
              height: 4,
              opacity: 1.1,
            },
          ],
          name: "h",
          then: {
            root: [
              {
                duration: 2,
                keyframes: [
                  {
                    width: input,
                  },
                ],
                name: "w",
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
            keyframes: [
              {
                height: 4,
                opacity: 1.1,
              },
            ],
            name: "h",
            options: {
              duration: 7,
            },
          },
          then: {
            root: [
              {
                apply: {
                  keyframes: [
                    {
                      width: expected,
                    },
                  ],
                  name: "w",
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
    name: `root container: ${input}`,
  })),
];

CASES.forEach(({ block, expected, name }) => {
  test(name, () => {
    const response = LayoutParser.parse({
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
          interaction: {
            drag: "none",
            focus: "none",
            hover: "none",
            press: "none",
          },
          lifecycle: "enter",
          style: {
            height: 21,
            left: 0,
            top: 0,
            width: 0,
          },
        },
      },
      prev: null,
      recipe: block,
    });
    expect(response).toEqual(expected);
  });
});
