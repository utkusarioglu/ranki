import type { TargetAnimationSpec } from "_controllers/geometry/geometry.animator.types.mjs";

export const ICON: TargetAnimationSpec = {
  "icon-span": {
    init: {
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
      ],
    },
    expand: {
      root: [
        {
          name: "opacity",
          // duration: 2000,
          duration: 0,
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
    init: {
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
    },
    move: {
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
        // {
        //   name: "width",
        //   // duration: 1000,
        //   duration: 0,
        //   keyframes: [
        //     {
        //       opacity: 1,
        //       width: "CONTAINER_WIDTH",
        //     },
        //   ],
        // },
      ],
    },
    expand: {
      root: [
        // {
        //   name: "height",
        //   duration: 0,
        //   keyframes: [
        //     {
        //       height: "CONTAINER_HEIGHT",
        //       // top: "CONTAINER_TOP",
        //       // left: "CONTAINER_LEFT",
        //     },
        //   ],
        // },
        {
          name: "width",
          // duration: 1000,
          duration: 0,
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
          // duration: 1000,
          duration: 0,
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
