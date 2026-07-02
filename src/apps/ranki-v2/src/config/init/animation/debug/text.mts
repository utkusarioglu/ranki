import type { TargetAnimationSpec } from "_controllers/geometry/geometry.animator.types.mjs";

export const TEXT: TargetAnimationSpec = {
  "text-span": {
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
    leave: {
      root: [
        {
          name: "opacity",
          // duration: 1000,
          duration: 0,
          keyframes: [
            {
              opacity: 0,
            },
          ],
        },
      ],
    },
  },
  text: {
    init: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              height: "CONTAINER_HEIGHT",
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
              // height: "CONTAINER_HEIGHT",
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
        {
          name: "height",
          duration: 0,
          keyframes: [
            {
              height: "CONTAINER_HEIGHT",
              // top: "CONTAINER_TOP",
              // left: "CONTAINER_LEFT",
            },
          ],
        },
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
        "text-span": {
          inform: {
            width: "CONTAINER_WIDTH",
            height: "CONTAINER_HEIGHT",
          },
        },
      },
    },
    contract: {
      root: [
        // {
        //   name: "position",
        //   duration: 0,
        //   keyframes: [
        //     {
        //       height: "CONTAINER_HEIGHT",
        //       top: "CONTAINER_TOP",
        //       left: "CONTAINER_LEFT",
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
        "text-span": {
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
