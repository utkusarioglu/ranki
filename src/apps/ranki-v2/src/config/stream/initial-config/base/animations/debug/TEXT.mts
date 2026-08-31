import type { GeometryAnimationPreset } from "_controllers/geometry/controller/animator/types/library.types.mjs";

export const TEXT: GeometryAnimationPreset = {
  text: {
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
          children: {
            override: {
              height: "= to.self.height",
              width: "= to.self.width",
            },
          },
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
        sets: {
          children: {
            // override: {
            //   width: "= to.self.width",
            //   height: "= to.self.height",
            // },
          },
        },
      },
    },
  },

  "text-span": {
    lifecycle: {
      update: {},
      enter: {
        root: [
          {
            duration: 0,
            keyframes: [
              {
                height: "= to.self.height + 1",
                opacity: 0,
              },
            ],
            name: "init",
          },
          {
            duration: 0,
            keyframes: [
              {
                opacity: 1,
                width: "= to.self.width + 1",
              },
            ],
            name: "opacity",
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
            name: "opacity",
          },
        ],
      },
    },
  },
};
