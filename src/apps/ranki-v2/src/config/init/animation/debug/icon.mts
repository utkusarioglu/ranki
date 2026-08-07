import type { TargetAnimationSpec } from "_controllers/geometry/controller/animator/animator.types.mjs";

export const ICON: TargetAnimationSpec = {
  "icon-span": {
    always: {},
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
          name: "to.self.height",
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
        "icon-span": {
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
              height: "to.container.height",
              top: "to.container.top",
              left: "to.container.left",
            },
          ],
        },
      ],
    },
    resize: {
      root: [
        {
          name: "width",
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
            width: "to.container.width",
            height: "to.container.height",
          },
        },
      },
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
    always: {},
  },
};
