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
  ...Array.from({ length: 10 }, (_, i) => i * 10).map((w) => ({
    block: {
      root: [
        {
          duration: 0,
          keyframes: [
            {
              height: 1,
            },
          ],
          name: "h",
          then: {
            root: [
              {
                duration: 2,
                keyframes: [
                  {
                    width: "to.self.width",
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
                height: 1,
              },
            ],
            name: "h",
            options: {
              duration: 0,
            },
          },
          then: {
            root: [
              {
                apply: {
                  keyframes: [
                    {
                      width: 21,
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
    name: `root then: ${w}`,
  })),
];

CASES.forEach(({ block, expected, name }) => {
  test(name, () => {
    const response = LayoutParser.parse({
      block,
      curr: {
        actions: ["enter"],
        container: {
          style: {
            width: 11,
          },
        },
        context: {
          index: 0,
          length: 1,
          stagger: 0,
        },
        self: {
          intent: "enter",
          style: {
            height: 0,
            left: 0,
            top: 0,
            width: 21,
          },
        },
      },
      prev: null,
    });
    expect(response).toEqual(expected);
  });
});
