import type { TargetAnimationSpec } from "_controllers/geometry/controller/animator/animator.types.mjs";

export const CHIP: TargetAnimationSpec = {
  chip: {
    enter: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              // top: "to.container.top",
              // left: "to.container.left",
              top: "to.self.top",
              left: "to.self.left",
              width: "to.self.width",
              height: "to.self.height",
            },
          ],
        },
      ],
      sets: {
        bg: {
          // wait: "STAGGER_INDEX * 1000",
          wait: 0,
          expose: {
            width: "to.container.width",
            height: "to.container.height",
            // width: "to.self.width",
            // height: "to.self.height",
          },
        },
        children: {
          // wait: "STAGGER_INDEX * 1000 + 1000",
          wait: 0,
          expose: {
            left: "to.self.left",
            top: "to.self.top",
            width: "to.self.width",
            height: "to.self.height",
          },
        },
      },
    },
    "hover-start": {
      root: [
        {
          name: "hover",
          duration: 100,
          keyframes: [
            {
              scale: 2,
            },
          ],
        },
      ],
    },
    move: {
      root: [
        {
          name: "move",
          duration: 0,
          keyframes: [
            {
              top: "to.container.top",
              left: "to.container.left",
            },
          ],
        },
      ],
    },
    resize: {
      // root: [
      //   {
      //     name: "init",
      //     duration: 0,
      //     keyframes: [
      //       {
      //         top: "to.container.top",
      //         left: "to.container.left",
      //       },
      //     ],
      //   },
      // ],
      sets: {
        bg: {
          // wait: "STAGGER_INDEX * 1000",
          wait: 0,
          expose: {
            width: "to.container.width",
            height: "to.container.height",
          },
        },
        children: {
          // wait: "STAGGER_INDEX * 1000 + 1000",
          wait: 0,
          expose: {
            left: "to.self.left",
            top: "to.self.top",
          },
        },
      },
    },
    // contract: {
    //   root: [
    //     {
    //       name: "reposition",
    //       // duration: 1000,
    //       duration: 0,
    //       keyframes: [
    //         {
    //           top: "to.container.top",
    //           left: "to.container.left",
    //         },
    //       ],
    //     },
    //   ],
    //   targets: {
    //     bg: {
    //       // wait: "STAGGER_INDEX * 1000",
    //       wait: 0,
    //       inform: {
    //         width: "to.container.width",
    //         height: "to.container.height",
    //       },
    //     },
    //     content: {
    //       // wait: "STAGGER_INDEX * 1000 + 1000",
    //       wait: 0,
    //       inform: {
    //         left: "to.self.left",
    //         top: "to.self.top",
    //       },
    //     },
    //   },
    // },
    leave: {
      // root: [
      //   {
      //     name: "reposition",
      //     duration: 1000,
      //     keyframes: [
      //       {
      //         top: "to.container.top",
      //         left: "to.container.left",
      //       },
      //     ],
      //   },
      // ],
      sets: {
        children: {
          // wait: "STAGGER_INDEX * 1000",
          wait: 0,
          expose: {
            width: 0,
          },
          then: {
            sets: {
              bg: {
                // wait: "STAGGER_INDEX * 1000",
                expose: {
                  width: 0,
                  // width: "to.container.width",
                  // height: "to.container.height",
                },
              },
            },
          },
        },
      },
    },
  },
};
