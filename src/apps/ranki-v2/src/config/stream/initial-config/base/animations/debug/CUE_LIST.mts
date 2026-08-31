import type { GeometryAnimationPreset } from "_controllers/geometry/controller/animator/types/library.types.mjs";

export const CUE_LIST: GeometryAnimationPreset = {
  "cue-list": {
    lifecycle: {
      enter: {
        root: [
          {
            duration: 0,
            keyframes: [
              {
                left: "= to.self.left",
                top: "= to.self.top",
              },
            ],
            name: "init",
          },
        ],
        sets: {
          bg: {
            override: {
              height: "= to.self.height",
              width: "= to.self.width",
            },
          },
          children: {
            expose: {
              left: "= to.self.left",
              top: "= to.self.top",
            },
            wait: 0,
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
              },
            ],
            name: "leave",
          },
        ],
      },
      update: {
        root: [
          {
            delay: 0,
            duration: 0,
            keyframes: [
              {
                left: "= to.self.left",
                top: "= to.self.top",
                // width: "= to.self.width",
                // height: "= to.self.height",
              },
            ],
            name: "position",
          },
        ],
        sets: {
          bg: {
            override: {
              height: "= to.self.height",
              width: "= to.self.width",
            },
          },
          children: {
            expose: {
              left: "= to.self.left",
              top: "= to.self.top",
            },
            wait: 0,
          },
        },
      },
    },
  },
};
