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
      ],
      sets: {
        children: {
          expose: {
            width: "to.self.width",
            height: "to.self.height",
          },
          // override: {
          //   top: "to.self.",
          // },
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
              left: "to.self.left",
              top: "to.self.top",
              width: "to.self.width",
              height: "to.self.height",
            },
          ],
        },
      ],
    },
    // resize: {
    //   sets: {
    //     children: {
    //       expose: {
    //         top: 0,
    //         left: 0,
    //       },
    //     },
    //   },
    // },
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
      sets: {
        bg: {
          expose: {
            width: "to.container.width",
            height: "to.container.height",
          },
        },
        children: {
          wait: 0,
          expose: {
            top: "to.self.top",
            left: "to.self.left",
            width: "to.self.width",
            height: "to.self.height",
          },
        },
      },
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
              height: "to.self.height",
            },
          ],
        },
      ],
    },

    // resize: {
    //   root: [
    //     {
    //       name: "width",
    //       duration: 0,
    //       keyframes: [
    //         {
    //           width: "to.container.width",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // leave: {
    //   root: [
    //     {
    //       name: "opacity",
    //       duration: 0,
    //       keyframes: [
    //         {
    //           width: 0,
    //           opacity: 0,
    //         },
    //       ],
    //     },
    //   ],
    // },
  },
};
