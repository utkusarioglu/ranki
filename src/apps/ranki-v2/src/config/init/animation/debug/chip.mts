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
          // override: {
          //   left: "to.self.left",
          //   top: "to.self.top",
          // },
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
    update: {
      root: [
        {
          name: "position",
          keyframes: [
            {
              left: "to.self.left",
              top: "to.self.top",
              width: "to.self.width",
              height: "to.self.height",
            },
          ],
          delay: 0,
          // duration: 1000,
          duration: 0,
        },
      ],
    },
    leave: {
      root: [
        {
          name: "position",
          keyframes: [
            {
              // left: "to.self.left",
              // top: "to.self.top",
              width: 0,
              // height: "to.self.height",
            },
          ],
          delay: 0,
          // duration: 1000,
          duration: 0,
        },
      ],
    },
  },
};
