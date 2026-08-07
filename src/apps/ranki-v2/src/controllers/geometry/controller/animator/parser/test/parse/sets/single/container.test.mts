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
          //         intent: "enter",
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
      // then: {
      //   root: [
      //     {
      //       apply: {
      //         name: "h",
      //         keyframes: [
      //           {
      //             height: expected,
      //           },
      //         ],
      //         options: {
      //           duration: 0,
      //         },
      //       },
      //     },
      //   ],
      // },
    },
    name: `root container: ${input}`,
  })),
];

CASES.forEach(({ block, expected, name }) => {
  test(name, () => {
    const response = LayoutParser.parse({
      block,
      curr: {
        actions: ["enter"],
        container: {
          // intent: "enter",
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
          intent: "enter",
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
