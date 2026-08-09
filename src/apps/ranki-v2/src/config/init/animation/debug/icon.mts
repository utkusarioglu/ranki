import type { TargetAnimationSpec } from "_controllers/geometry/controller/animator/animator.types.mjs";

export const ICON: TargetAnimationSpec = {
  "icon-span": {
    enter: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              width: 0,
              height: "to.self.height",
              opacity: 0,
            },
          ],
        },
        {
          name: "width",
          duration: 0,
          keyframes: [
            {
              width: "to.self.width",
              opacity: 1,
            },
          ],
        },
      ],
    },
  },

  icon: {
    enter: {
      root: [
        {
          name: "height",
          duration: 0,
          keyframes: [
            {
              height: "to.self.height",
            },
          ],
        },
        {
          name: "width",
          duration: 0,
          keyframes: [
            {
              opacity: 1,
              width: "to.self.width",
            },
          ],
        },
      ],
      sets: {
        children: {},
      },
    },
    update: {
      root: [
        {
          name: "position",
          duration: 0,
          keyframes: [
            {
              left: "to.self.left",
              top: "to.self.top",
              width: "to.self.width",
              height: "to.self.height",
            },
          ],
        },
      ],
    },
    leave: {
      root: [
        {
          name: "exit",
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
