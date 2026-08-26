import type { GeometryAnimationPreset } from "_controllers/geometry/controller/animator/types/library.types.mjs";

export const HUD: GeometryAnimationPreset = {
  hud: {
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
            name: "size",
          },
          {
            duration: 0,
            keyframes: [
              // {
              //   top: "= to.self.height * -1",
              // },
              {
                top: 10,
              },
            ],
            name: "position",
          },
        ],
        sets: {
          children: {
            expose: {
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
              },
            ],
            name: "leave",
          },
        ],
      },
      update: {
        root: [
          {
            duration: 0,
            keyframes: [
              {
                // left: "= to.self.left",
                // top: "= to.self.top",
                // width: "= to.self.width",
                // height: "= to.self.height",
              },
            ],
            name: "position",
          },
        ],
        sets: {
          children: {
            expose: {
              height: "= to.self.height",
              width: "= to.self.width",
            },
          },
        },
      },
    },
  },

  "hud-bg": {
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
                width: 0,
              },
            ],
            name: "opacity",
          },
        ],
      },
      update: {
        root: [
          {
            duration: 0,
            keyframes: [
              {
                // left: "= to.self.left",
                // top: "= to.self.top",
                width: "= to.self.width",
                // height: "= to.self.height",
              },
            ],
            name: "position",
          },
        ],
      },
    },
  },

  "hud-scroller": {
    lifecycle: {
      enter: {
        root: [
          {
            duration: 0,
            keyframes: [
              {
                height: "= to.self.height",
                // top: "= to.self.top",
              },
            ],
            name: "init",
            then: {
              root: [
                {
                  duration: 0,
                  keyframes: [
                    {
                      width: "= to.self.width",
                    },
                  ],
                  name: "size",
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
      update: {
        root: [
          {
            duration: 0,
            keyframes: [
              {
                width: "= to.self.width",
              },
            ],
            name: "size",
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
        // sets: {
        //   children: {
        //     expose: {
        //       width: "= to.self.width",
        //       height: "= to.self.height",
        //     },
        //   },
        // },
      },
    },
  },
};
