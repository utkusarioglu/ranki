import type { TargetAnimationSpec } from "_controllers/geometry/controller/animator/animator.types.mjs";

export const CHIP: TargetAnimationSpec = {
  chip: {
    always: {},
    enter: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              top: "to.self.top",
              left: "to.self.left",
              // width: "to.self.width",
              // height: "to.self.height",
            },
          ],
        },
      ],
      sets: {
        bg: {
          wait: 0,
          override: {
            width: "to.self.width",
            height: "to.self.height",
          },
        },
        children: {
          wait: 0,
          // expose: {
          // left: "to.self.left",
          // top: "to.self.top",
          // width: "to.self.width",
          // height: "to.self.height",
          // },
        },
      },
    },
    // "hover-start": {
    //   root: [
    //     {
    //       name: "hover",
    //       duration: 100,
    //       keyframes: [
    //         {
    //           scale: 2,
    //         },
    //       ],
    //     },
    //   ],
    // },
    move: {
      // root: [
      //   {
      //     name: "move",
      //     duration: 0,
      //     keyframes: [
      //       {
      // top: "to.self.top",
      // left: "to.self.left",
      //       },
      //     ],
      //   },
      // ],
    },
    // resize: {
    //   sets: {
    //     bg: {
    //       wait: 0,
    //       expose: {
    //         width: "to.container.width",
    //         height: "to.container.height",
    //       },
    //     },
    //     children: {
    //       wait: 0,
    //       expose: {
    //         left: "to.self.left",
    //         top: "to.self.top",
    //       },
    //     },
    //   },
    // },
    // leave: {
    //   sets: {
    //     children: {
    //       wait: 0,
    //       expose: {
    //         width: 0,
    //       },
    //       then: {
    //         sets: {
    //           bg: {
    //             expose: {
    //               width: 0,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
  },
};
