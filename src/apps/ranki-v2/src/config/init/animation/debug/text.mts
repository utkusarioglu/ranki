import type { GeometryAnimationPreset } from "_controllers/geometry/controller/animator/types/library.types.mjs";

export const TEXT: GeometryAnimationPreset = {
  text: {
    enter: {
      root: [
        {
          name: "height",
          duration: 0,
          keyframes: [
            {
              height: "= to.self.height",
            },
          ],
        },
        {
          name: "width",
          duration: 0,
          keyframes: [
            {
              opacity: 1,
              width: "= to.self.width",
            },
          ],
        },
        {
          name: "position",
          duration: 0,
          keyframes: [
            {
              left: "= to.self.left",
              top: "= to.self.top",
            },
          ],
        },
      ],
      sets: {
        children: {
          override: {
            width: "= to.self.width",
            height: "= to.self.height",
          },
        },
      },
    },
    update: {
      root: [
        {
          name: "position",
          duration: 0,
          keyframes: [
            {
              left: "= to.self.left",
              top: "= to.self.top",
              width: "= to.self.width",
              height: "= to.self.height",
            },
          ],
        },
      ],
      sets: {
        children: {
          // override: {
          //   width: "= to.self.width",
          //   height: "= to.self.height",
          // },
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
  },

  "text-span": {
    enter: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              height: "= to.self.height + 1",
              opacity: 0,
            },
          ],
        },
        {
          name: "opacity",
          duration: 0,
          keyframes: [
            {
              width: "= to.self.width + 1",
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
};
