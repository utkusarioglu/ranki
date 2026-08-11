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
    "hover-start": {
      sets: {
        bg: {
          override: {
            left: -10,
            width: "to.self.width + 20",
            height: "to.self.height",
            // backgroundColor: "#FFFFFF",
          },
        },
      },
      // root: [
      //   {
      //     name: "hover",
      //     duration: 100,
      //     keyframes: [
      //       {
      //         // scale: 2,
      //         // left: "to.self.left - 10",
      //         // width: "to.self.width + 20",
      //       },
      //     ],
      //   },
      // ],
    },
    "hover-end": {
      sets: {
        bg: {
          override: {
            left: 0,
            width: "to.self.width",
            height: "to.self.height",
            // width: 100,
            // backgroundColor: "#FFFFFF",
          },
        },
      },
      // root: [
      //   {
      //     name: "hover",
      //     duration: 100,
      //     keyframes: [
      //       {
      //         left: "to.self.left",
      //         width: "to.self.width",
      //         // scale: 1,
      //       },
      //     ],
      //   },
      // ],
    },
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
          duration: 1000,
        },
      ],
    },
  },
};
