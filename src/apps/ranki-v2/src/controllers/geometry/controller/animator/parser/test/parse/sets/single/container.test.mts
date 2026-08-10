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
      ["to.container.height", 11],
      ["to.self.height", 21],
    ] as [string, number][]
  ).map(([input, expected]) => ({
    block: {
      sets: {
        one: {
          expose: {
            height: input,
          },
          wait: 1,
        },
      },
      // then: {
      //   root: [
      //     {
      //       name: "h",
      //       duration: 0,
      //       keyframes: [
      //         {
      //           height: input,
      //         },
      //       ],
      //     },
      //   ],
      // },
    },
    expected: {
      root: undefined,
      sets: {
        one: {
          props: {
            containerExposed: {
              style: {
                height: expected,
              },
            },
            selfOverrides: {
              lifecycle: "enter" as const,
              interaction: {
                hover: "none" as const,
                focus: "none" as const,
                press: "none" as const,
                drag: "none" as const,
              },
              style: {},
            },
            setName: "one",
          },
          wait: 1,
          // target: {
          //   props: {
          //     curr: {
          //       /**
          //        * Findings: model error
          //        *
          //        * The parser should use item's style to populate the container's props here. but in the code it still uses the container's styles.
          //        * It also cannot produce context as the context is known by the child. the container's context is projected down. which is wrong
          //        */
          //       container: {
          //         lifecycle: "enter",
          //         style: {
          //           height: 21,
          //         },
          //       },
          //     },
          //     prev: null,
          //   },
          // },
        },
      },
      then: undefined,
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
