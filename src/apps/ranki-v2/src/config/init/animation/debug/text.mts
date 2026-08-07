import type { TargetAnimationSpec } from "_controllers/geometry/controller/animator/animator.types.mjs";

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
          name: "to.self.height",
          duration: 0,
          keyframes: [
            {
              // height: "to.container.height",
              height: "to.self.height",
              // top: "to.container.top",
              // left: "to.container.left",
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
              // width: "to.container.width",
              width: "to.self.width",
            },
          ],
        },
      ],
      sets: {
        children: {
          expose: {
            width: "to.self.width",
            height: "to.self.height",
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
              // height: "to.container.height",
              top: "to.container.top",
              left: "to.container.left",
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
        //       width: "to.container.width",
        //     },
        //   ],
        // },
      ],
    },
    resize: {
      root: [
        // {
        //   name: "to.self.height",
        //   duration: 0,
        //   keyframes: [
        //     {
        //       height: "to.container.height",
        //       // top: "to.container.top",
        //       // left: "to.container.left",
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
              width: "to.container.width",
            },
          ],
        },
      ],
      sets: {
        children: {
          expose: {
            width: "to.self.width",
            height: "to.self.height",
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
    //     //       height: "to.container.height",
    //     //       top: "to.container.top",
    //     //       left: "to.container.left",
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
    //           width: "to.container.width",
    //         },
    //       ],
    //     },
    //   ],
    //   targets: {
    //     "text-span": {
    //       inform: {
    //         // width: "to.container.width",
    //         // height: "to.container.height",
    //         width: "to.self.width",
    //         height: "to.self.height",
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
