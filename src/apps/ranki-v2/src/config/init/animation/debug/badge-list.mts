import type { TargetAnimationSpec } from "_controllers/geometry/controller/animator/animator.types.mjs";

export const BADGE_LIST: TargetAnimationSpec = {
  "badge-list": {
    enter: {
      root: [
        {
          name: "init",
          keyframes: [
            {
              top: "to.self.top",
              left: "to.self.left",
            },
          ],
          // delay: 0,
          // duration: 1000,
          duration: 0,
        },
      ],
      sets: {
        bg: {
          // wait: 0,
          expose: {
            // width: "to.container.width",
            // height: "to.container.height",
            width: "to.self.width",
            height: "to.self.height",
          },
        },
        children: {
          // wait: 1000,
          // wait: 0,
          expose: {
            top: "to.self.top",
            left: "to.self.left",
            width: "to.self.width",
          },
        },
      },
    },
    move: {
      root: [
        {
          name: "position",
          keyframes: [
            {
              top: "to.self.top",
              left: "to.self.left",
            },
          ],
          delay: 0,
          // duration: 1000,
          duration: 0,
        },
      ],
    },
    resize: {
      // root: [
      //   {
      //     name: "position",
      //     keyframes: [
      //       {
      //         top: "to.self.top",
      //         left: "to.self.left",
      //       },
      //     ],
      //     delay: 0,
      //     // duration: 1000,
      //     duration: 0,
      //   },
      // ],
      sets: {
        bg: {
          wait: 0,
          expose: {
            width: "to.container.width",
            height: "to.container.height",
          },
        },
        children: {
          // wait: 1000,
          wait: 0,
          expose: {
            top: "to.self.top",
            left: "to.self.left",
            width: "to.self.width",
          },
        },
      },
    },
  },
};
