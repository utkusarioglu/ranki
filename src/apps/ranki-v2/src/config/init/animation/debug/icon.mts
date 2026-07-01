import type { TargetAnimationSpec } from "_/controllers/geometry/geometry.animator.types.mjs";

export const ICON: TargetAnimationSpec = {
  "icon-span": {
    expand: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              height: "CONTAINER_HEIGHT + 1",
              width: "CONTAINER_WIDTH + 1",
              opacity: 0,
            },
          ],
        },
        {
          name: "opacity",
          duration: 2000,
          keyframes: [
            {
              opacity: 1,
            },
          ],
        },
      ],
    },
  },
  icon: {
    expand: {
      root: [
        {
          name: "position",
          duration: 0,
          keyframes: [
            {
              height: "CONTAINER_HEIGHT",
              top: "CONTAINER_TOP",
              left: "CONTAINER_LEFT",
            },
          ],
        },
        {
          name: "width",
          duration: 1000,
          keyframes: [
            {
              opacity: 1,
              width: "CONTAINER_WIDTH",
            },
          ],
        },
      ],
      targets: {
        "icon-span": {
          inform: {
            width: "CONTAINER_WIDTH",
            height: "CONTAINER_HEIGHT",
          },
        },
      },
    },
    exit: {
      root: [
        {
          name: "exit",
          duration: 1000,
          keyframes: [
            {
              opacity: 0,
              width: 0,
            },
          ],
        },
      ],
    },
  },
};
