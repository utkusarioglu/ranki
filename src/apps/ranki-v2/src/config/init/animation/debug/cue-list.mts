import type { TargetAnimationSpec } from "_/controllers/geometry/geometry.animator.types.mjs";

export const CUE_LIST: TargetAnimationSpec = {
  "cue-list": {
    expand: {
      root: [
        {
          name: "position",
          keyframes: [
            {
              top: "CONTAINER_TOP",
              left: "CONTAINER_LEFT",
            },
          ],
          // duration: 1000,
          duration: 0,
        },
      ],
      targets: {
        bg: {
          inform: {
            width: "CONTAINER_WIDTH",
            height: "CONTAINER_HEIGHT",
          },
        },
        lists: {
          // wait: 1000,
          wait: 0,
          inform: {
            top: "TOP",
            left: "LEFT",
          },
        },
      },
    },
    contract: {
      targets: {
        lists: {
          inform: {
            top: "TOP",
            left: "LEFT",
          },
          then: {
            root: [
              {
                name: "position",
                // duration: 1000,
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
                // wait: 1000,
                inform: {
                  width: "CONTAINER_WIDTH",
                  height: "CONTAINER_HEIGHT",
                },
              },
            },
          },
        },
      },
    },
  },
};
