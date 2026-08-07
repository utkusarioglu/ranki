import type { TargetAnimationSpec } from "_controllers/geometry/controller/animator/animator.types.mjs";

export const TEXT: TargetAnimationSpec = {
  "text-span": {
    always: {},
    // !FIX: THIS SHOULDN'T BE NEEDED
    resize: {},
    enter: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              height: "HEIGHT + 1",
              width: "WIDTH + 1",
              opacity: 0,
            },
          ],
        },
        {
          name: "opacity",
          duration: 0,
          keyframes: [
            {
              opacity: 1,
            },
          ],
        },
      ],
    },
    leave: {
      root: [
        {
          name: "opacity",
          duration: 0,
          keyframes: [
            {
              opacity: 0,
            },
          ],
        },
      ],
    },
  },
  text: {
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
        children: {
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
            width: "to.self.width",
            height: "to.self.height",
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
