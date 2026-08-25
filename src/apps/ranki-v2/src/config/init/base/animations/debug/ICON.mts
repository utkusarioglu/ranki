import type { GeometryAnimationPreset } from "_controllers/geometry/controller/animator/types/library.types.mjs";

export const ICON: GeometryAnimationPreset = {
  icon: {
    lifecycle: {
      enter: {
        root: [
          {
            duration: 0,
            keyframes: [
              {
                height: "= to.self.height",
              },
            ],
            name: "height",
          },
          {
            duration: 0,
            keyframes: [
              {
                opacity: 1,
                width: "= to.self.width",
              },
            ],
            name: "width",
          },
          {
            duration: 0,
            keyframes: [
              {
                left: "= to.self.left",
                top: "= to.self.top",
              },
            ],
            name: "position",
          },
        ],
        sets: {
          children: {},
        },
      },
      leave: {
        root: [
          {
            duration: 0,
            keyframes: [
              {
                opacity: 0,
                width: 0,
              },
            ],
            name: "exit",
          },
        ],
      },
      update: {
        root: [
          {
            duration: 0,
            keyframes: [
              {
                height: "= to.self.height",
                left: "= to.self.left",
                top: "= to.self.top",
                width: "= to.self.width",
              },
            ],
            name: "position",
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
            duration: 0,
            keyframes: [
              {
                height: "= to.self.height",
                opacity: 0,
                width: 0,
              },
            ],
            name: "init",
          },
          {
            duration: 0,
            keyframes: [
              {
                opacity: 1,
                width: "= to.self.width",
              },
            ],
            name: "width",
          },
        ],
      },
      leave: {
        root: [
          {
            duration: 0,
            keyframes: [
              {
                opacity: 0,
              },
            ],
            name: "leave",
          },
        ],
      },
    },
  },
};
