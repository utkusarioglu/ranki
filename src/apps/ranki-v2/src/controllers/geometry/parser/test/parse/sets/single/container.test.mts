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
      sets: {
        one: {
          wait: 1,
          inform: {
            height: "HEIGHT",
          },
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
      then: undefined,
      sets: {
        one: {
          wait: 1,
          props: {
            setName: "one",
            container: {
              style: {
                height: 21,
              },
            },
          },
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
          // intent: "enter",
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
