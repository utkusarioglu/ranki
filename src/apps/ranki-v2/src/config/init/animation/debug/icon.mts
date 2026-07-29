import type { TargetAnimationSpec } from "_controllers/geometry/animator/animator.types.mjs";

export const ICON: TargetAnimationSpec = {
  "icon-span": {
    enter: {
      root: [
        {
          name: "init",
          // duration: 2000,
          duration: 0,
          keyframes: [
            {
              width: 0,
              // height: "CONTAINER_HEIGHT",
              height: "HEIGHT",
              opacity: 0,
            },
          ],
        },
        {
          name: "width",
          // duration: 2000,
          duration: 0,
          keyframes: [
            {
              // width: "CONTAINER_WIDTH",
              width: "WIDTH",
              opacity: 1,
            },
          ],
        },
      ],
    },
  },

  icon: {
    enter: {
      root: [
        {
          name: "height",
          duration: 0,
          keyframes: [
            {
              // height: "CONTAINER_HEIGHT",
              height: "HEIGHT",
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
              // width: "CONTAINER_WIDTH",
              width: "WIDTH",
            },
          ],
        },
      ],
      sets: {
        "icon-span": {
          inform: {
            // width: "CONTAINER_WIDTH",
            width: "WIDTH",
            // height: "CONTAINER_HEIGHT",
            height: "HEIGHT",
          },
        },
      },
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
    resize: {
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
      sets: {
        "icon-span": {
          inform: {
            width: "CONTAINER_WIDTH",
            height: "CONTAINER_HEIGHT",
          },
        },
      },
    },
    leave: {
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
