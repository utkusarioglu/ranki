import type { TargetAnimationSpec } from "_controllers/geometry/animator/animator.types.mjs";

export const HUD: TargetAnimationSpec = {
  "hud-bg": {
    enter: {
      root: [
        {
          name: "height",
          duration: 0,
          keyframes: [
            {
              // height: "CONTAINER_HEIGHT",
              height: "HEIGHT",
            },
          ],
        },
        {
          name: "opacity",
          // duration: 1000,
          duration: 0,
          keyframes: [
            {
              // width: "CONTAINER_WIDTH",
              width: "WIDTH",
              opacity: 1,
            },
          ],
        },
      ],
    },
    resize: {
      root: [
        {
          name: "width",
          // duration: 1000,
          duration: 0,
          keyframes: [
            {
              // width: "CONTAINER_WIDTH",
              width: "WIDTH",
            },
          ],
        },
      ],
    },
    // contract: {
    //   root: [
    //     {
    //       name: "opacity",
    //       // duration: 1000,
    //       duration: 0,
    //       keyframes: [
    //         {
    //           width: "CONTAINER_WIDTH",
    //           opacity: 1,
    //         },
    //       ],
    //     },
    //   ],
    // },
    leave: {
      root: [
        {
          name: "opacity",
          // duration: 1000,
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

  "hud-scroller": {
    resize: {
      root: [
        {
          name: "size",
          // duration: 1000,
          duration: 0,
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
          // wait: 1000,
          wait: 0,
          inform: {
            top: "TOP",
            left: "LEFT",
            width: "WIDTH",
            height: "HEIGHT",
          },
        },
      },
    },
    // contract: {
    //   targets: {
    //     // TODO list items need to get their z-index set
    //     sections: {
    //       inform: {
    //         top: "TOP",
    //         left: "LEFT",
    //       },
    //       then: {
    //         root: [
    //           {
    //             name: "position",
    //             // duration: 1000,
    //             duration: 0,
    //             keyframes: [
    //               {
    //                 width: "CONTAINER_WIDTH",
    //               },
    //             ],
    //           },
    //         ],
    //         targets: {
    //           bg: {
    //             // wait: 1000,
    //             inform: {
    //               width: "CONTAINER_WIDTH",
    //               height: "CONTAINER_HEIGHT",
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    enter: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              // height: "CONTAINER_HEIGHT",
              height: "HEIGHT",
              // left: "CONTAINER_WIDTH / 2",
              // top: "-CONTAINER_HEIGHT",
              top: "TOP",
            },
          ],
          then: {
            root: [
              {
                name: "size",
                // duration: 1000,
                duration: 0,
                keyframes: [
                  {
                    // left: 0,
                    // width: "CONTAINER_WIDTH",
                    width: "WIDTH",
                  },
                ],
              },
            ],
            targets: {
              bg: {
                inform: {
                  // width: "CONTAINER_WIDTH",
                  // height: "CONTAINER_HEIGHT",
                  width: "WIDTH",
                  height: "HEIGHT",
                },
              },
              sections: {
                // wait: 1000,
                wait: 0,
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
  },
  hud: {
    enter: {
      root: [
        {
          name: "size",
          duration: 0,
          keyframes: [
            {
              // height: "CONTAINER_HEIGHT",
              height: "HEIGHT",
            },
          ],
        },
      ],
      targets: {
        scroller: {
          inform: {
            top: 0,
            left: 0,
            width: "WIDTH",
            height: "HEIGHT",
          },
        },
      },
    },
    resize: {
      // root: [
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
      // ],
      targets: {
        scroller: {
          inform: {
            top: 0,
            left: 0,
          },
        },
      },
    },
    // contract: {
    //   targets: {
    //     scroller: {
    //       inform: {
    //         top: 0,
    //         left: 0,
    //       },
    //     },
    //   },
    // },
  },
};
