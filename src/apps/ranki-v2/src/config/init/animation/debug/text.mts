import type { TargetAnimationSpec } from "_controllers/geometry/animator/animator.types.mjs";

export const TEXT: TargetAnimationSpec = {
  "text-span": {
    // !FIX: THIS SHOULDN'T BE NEEDED
    resize: {},
    enter: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              // height: "CONTAINER_HEIGHT + 1",
              // width: "CONTAINER_WIDTH + 1",
              height: "HEIGHT + 1",
              width: "WIDTH + 1",
              opacity: 0,
            },
          ],
        },
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
        "text-span": {
          inform: {
            width: "WIDTH",
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
        "text-span": {
          inform: {
            width: "WIDTH",
            height: "HEIGHT",
          },
        },
      },
    },
    // contract: {
    //   root: [
    //     // {
    //     //   name: "position",
    //     //   duration: 0,
    //     //   keyframes: [
    //     //     {
    //     //       height: "CONTAINER_HEIGHT",
    //     //       top: "CONTAINER_TOP",
    //     //       left: "CONTAINER_LEFT",
    //     //     },
    //     //   ],
    //     // },
    //     {
    //       name: "width",
    //       // duration: 1000,
    //       duration: 0,
    //       keyframes: [
    //         {
    //           opacity: 1,
    //           width: "CONTAINER_WIDTH",
    //         },
    //       ],
    //     },
    //   ],
    //   targets: {
    //     "text-span": {
    //       inform: {
    //         // width: "CONTAINER_WIDTH",
    //         // height: "CONTAINER_HEIGHT",
    //         width: "WIDTH",
    //         height: "HEIGHT",
    //       },
    //     },
    //   },
    // },
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
