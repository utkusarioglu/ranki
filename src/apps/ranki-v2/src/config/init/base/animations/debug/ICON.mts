import type { GeometryAnimationPreset } from "_controllers/geometry/controller/animator/types/library.types.mjs";

export const ICON: GeometryAnimationPreset = {
  icon: {
    lifecycle: {
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
                left: "= to.self.left",
                top: "= to.self.top",
                width: "= to.self.width",
                height: "= to.self.height",
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
  },
  "icon-span": {
    lifecycle: {
      enter: {
        root: [
          {
            name: "init",
            duration: 0,
            keyframes: [
              {
                width: 0,
                height: "= to.self.height",
                opacity: 0,
              },
            ],
          },
          {
            name: "width",
            duration: 0,
            keyframes: [
              {
                width: "= to.self.width",
                opacity: 1,
              },
            ],
          },
        ],
      },
      leave: {
        root: [
          {
            name: "leave",
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
  },
};
