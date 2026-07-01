import type { TargetAnimationSpec } from "_/controllers/geometry/geometry.animator.types.mjs";

export const HUD: TargetAnimationSpec = {
  "hud-bg": {
    expand: {
      root: [
        {
          name: "height",
          duration: 0,
          keyframes: [
            {
              height: "CONTAINER_HEIGHT",
            },
          ],
        },
        {
          name: "opacity",
          duration: 1000,
          keyframes: [
            {
              width: "CONTAINER_WIDTH",
              opacity: 1,
            },
          ],
        },
      ],
    },
    contract: {
      root: [
        {
          name: "opacity",
          duration: 1000,
          keyframes: [
            {
              width: "CONTAINER_WIDTH",
              opacity: 1,
            },
          ],
        },
      ],
    },
    exit: {
      root: [
        {
          name: "opacity",
          duration: 1000,
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

  "hud-scroller": {
    expand: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              height: "CONTAINER_HEIGHT",
              // left: "CONTAINER_WIDTH / 2",
              // top: "-CONTAINER_HEIGHT",
              top: "CONTAINER_TOP",
            },
          ],
          then: {
            root: [
              {
                name: "size",
                duration: 1000,
                keyframes: [
                  {
                    // left: 0,
                    width: "CONTAINER_WIDTH",
                  },
                ],
              },
            ],
            targets: {
              bg: {
                inform: {
                  width: "CONTAINER_WIDTH",
                  height: "CONTAINER_HEIGHT",
                },
              },
              sections: {
                wait: 1000,
                inform: {
                  top: "TOP",
                  left: "LEFT",
                },
              },
            },
          },
        },
      ],
    },
    contract: {
      targets: {
        // TODO list items need to get their z-index set
        sections: {
          inform: {
            top: "TOP",
            left: "LEFT",
          },
          then: {
            root: [
              {
                name: "position",
                duration: 1000,
                keyframes: [
                  {
                    width: "CONTAINER_WIDTH",
                  },
                ],
              },
            ],
            targets: {
              bg: {
                // wait: 1000,
                inform: {
                  width: "CONTAINER_WIDTH",
                  height: "CONTAINER_HEIGHT",
                },
              },
            },
          },
        },
      },
    },
  },
  hud: {
    expand: {
      root: [
        {
          name: "size",
          duration: 0,
          keyframes: [
            {
              height: "CONTAINER_HEIGHT",
              // top: "-CONTAINER_HEIGHT",
              // rotate: 0,
            },
          ],
        },
        // {
        //   name: "rot",
        //   duration: 1000,
        //   keyframes: [
        //     {
        //       // skewY: -30,
        //       // rotate3d: "1 2 3 50",
        //       // rotate: 360,
        //       // scale: 1.5,
        //       // top: 0,
        //     },
        //   ],
        // },
      ],
      targets: {
        scroller: {
          inform: {
            top: 0,
            left: 0,
          },
        },
      },
    },
    contract: {
      targets: {
        scroller: {
          inform: {
            top: 0,
            left: 0,
          },
        },
      },
    },
  },
};
