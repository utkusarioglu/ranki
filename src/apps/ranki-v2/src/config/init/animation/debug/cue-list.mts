import type { TargetAnimationSpec } from "_controllers/geometry/controller/animator/animator.types.mjs";

export const CUE_LIST: TargetAnimationSpec = {
  "cue-list": {
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
          duration: 0,
        },
      ],
    },
    //   resize: {
    //     sets: {
    //       bg: {
    //         expose: {
    //           width: "to.container.width",
    //           height: "to.container.height",
    //         },
    //       },
    //       children: {
    //         wait: 0,
    //         expose: {
    //           top: "to.self.top",
    //           left: "to.self.left",
    //         },
    //       },
    //     },
    //   },
  },
};
