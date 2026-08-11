import type { TargetAnimationSpec } from "_controllers/geometry/controller/animator/animator.types.mjs";

export const HUD: TargetAnimationSpec = {
  hud: {
    enter: {
      root: [
        {
          name: "size",
          duration: 0,
          keyframes: [
            {
              height: "to.self.height",
            },
          ],
        },
        {
          name: "position",
          duration: 0,
          keyframes: [
            // {
            //   top: "to.self.height * -1",
            // },
            {
              top: 10,
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
    update: {
      root: [
        {
          name: "position",
          duration: 0,
          keyframes: [
            {
              // left: "to.self.left",
              // top: "to.self.top",
              // width: "to.self.width",
              // height: "to.self.height",
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
  },

  "hud-scroller": {
    enter: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              height: "to.self.height",
              // top: "to.self.top",
            },
          ],
          then: {
            root: [
              {
                name: "size",
                duration: 0,
                keyframes: [
                  {
                    width: "to.self.width",
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
        },
      ],
    },
    update: {
      root: [
        {
          name: "size",
          duration: 0,
          keyframes: [
            {
              width: "to.self.width",
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
      // sets: {
      //   children: {
      //     expose: {
      //       width: "to.self.width",
      //       height: "to.self.height",
      //     },
      //   },
      // },
    },
  },

  "hud-bg": {
    enter: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              height: "to.self.height",
            },
          ],
        },
        {
          name: "opacity",
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
    update: {
      root: [
        {
          name: "position",
          duration: 0,
          keyframes: [
            {
              // left: "to.self.left",
              // top: "to.self.top",
              width: "to.self.width",
              // height: "to.self.height",
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
              width: 0,
              opacity: 0,
            },
          ],
        },
      ],
    },
  },
};
