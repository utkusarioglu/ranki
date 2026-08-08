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
          duration: 0,
        },
      ],
      sets: {
        bg: {
          override: {
            width: "to.self.width",
            height: "to.self.height",
          },
        },
        children: {
          expose: {
            // top: "to.self.top",
            // left: "to.self.left",
            // width: "to.self.width",
          },
        },
      },
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
    //         top: "to.self.top",
    //         left: "to.self.left",
    //         width: "to.self.width",
    //       },
    //     },
    //   },
    // },
  },
};
