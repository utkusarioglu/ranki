import type { TargetAnimationSpec } from "_/controllers/geometry/geometry.animator.types.mjs";

export const CHIP: TargetAnimationSpec = {
  chip: {
    expand: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              top: "CONTAINER_TOP",
              left: "CONTAINER_LEFT",
            },
          ],
        },
      ],
      targets: {
        bg: {
          wait: "STAGGER_INDEX * 1000",
          inform: {
            width: "CONTAINER_WIDTH",
            height: "CONTAINER_HEIGHT",
          },
        },
        content: {
          wait: "STAGGER_INDEX * 1000 + 1000",
          inform: {
            left: "LEFT",
            top: "TOP",
          },
        },
      },
    },
    contract: {
      root: [
        {
          name: "reposition",
          duration: 1000,
          keyframes: [
            {
              top: "CONTAINER_TOP",
              left: "CONTAINER_LEFT",
            },
          ],
        },
      ],
      targets: {
        bg: {
          wait: "STAGGER_INDEX * 1000",
          inform: {
            width: "CONTAINER_WIDTH",
            height: "CONTAINER_HEIGHT",
          },
        },
        content: {
          wait: "STAGGER_INDEX * 1000 + 1000",
          inform: {
            left: "LEFT",
            top: "TOP",
          },
        },
      },
    },
    exit: {
      // root: [
      //   {
      //     name: "reposition",
      //     duration: 1000,
      //     keyframes: [
      //       {
      //         top: "CONTAINER_TOP",
      //         left: "CONTAINER_LEFT",
      //       },
      //     ],
      //   },
      // ],
      targets: {
        content: {
          wait: "STAGGER_INDEX * 1000",
          inform: {
            width: 0,
          },
          then: {
            targets: {
              bg: {
                // wait: "STAGGER_INDEX * 1000",
                inform: {
                  width: 0,
                  // width: "CONTAINER_WIDTH",
                  // height: "CONTAINER_HEIGHT",
                },
              },
            },
          },
        },
      },
    },
  },
};
