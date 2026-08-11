import type { TargetAnimationSpec } from "_controllers/geometry/controller/animator/animator.types.mjs";

export const CUE_LIST: TargetAnimationSpec = {
  "cue-list": {
    enter: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              top: "to.self.top",
              left: "to.self.left",
            },
          ],
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
          wait: 0,
          expose: {
            top: "to.self.top",
            left: "to.self.left",
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
              // width: "to.self.width",
              // height: "to.self.height",
            },
          ],
          delay: 0,
          // duration: 1000,
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
          wait: 0,
          expose: {
            top: "to.self.top",
            left: "to.self.left",
          },
        },
      },
    },
  },
};
