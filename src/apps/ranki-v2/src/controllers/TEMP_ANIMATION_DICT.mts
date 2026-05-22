import type { AnimationDict } from "./geometry.animator.types.mts";

export const TEMP_ANIMATION_DICT: AnimationDict = {
  debug: {
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
      none: {},
    },
    "badge-list": {
      expand: {
        root: [
          {
            name: "position",
            keyframes: [
              {
                top: "TOP",
                left: "LEFT",
              },
            ],
            delay: 0,
            duration: 1000,
          },
        ],
        targets: {
          bg: {
            wait: 0,
            inform: {
              width: "CONTAINER_WIDTH",
              height: "CONTAINER_HEIGHT",
            },
          },
          chips: {
            wait: 1000,
            inform: {
              top: "TOP",
              left: "LEFT",
            },
          },
        },
      },
      contract: {
        targets: {
          chips: {
            inform: {
              top: "TOP",
              left: "LEFT",
            },
            then: {
              root: [
                {
                  name: "position",
                  keyframes: [
                    {
                      top: "CONTAINER_TOP",
                      left: "CONTAINER_LEFT",
                    },
                  ],
                  duration: 1000,
                },
              ],
              targets: {
                bg: {
                  wait: 0,
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
      none: {
        // targets: {
        //   bg: {
        //     inform: {
        //       width: "CONTAINER_WIDTH",
        //       height: "CONTAINER_HEIGHT",
        //     },
        //   },
        // },
      },
    },
    "cue-list": {
      expand: {
        root: [
          {
            name: "position",
            keyframes: [
              {
                top: "CONTAINER_TOP",
                left: "CONTAINER_LEFT",
              },
            ],
            duration: 1000,
          },
        ],
        targets: {
          bg: {
            inform: {
              width: "CONTAINER_WIDTH",
              height: "CONTAINER_HEIGHT",
            },
          },
          lists: {
            wait: 1000,
            inform: {
              top: "TOP",
              left: "LEFT",
            },
          },
        },
      },
      contract: {
        targets: {
          lists: {
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
                      top: "CONTAINER_TOP",
                      left: "CONTAINER_LEFT",
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
      none: {
        // targets: {
        //   bg: {
        //     inform: {
        //       width: "CONTAINER_WIDTH",
        //       height: "CONTAINER_HEIGHT",
        //     },
        //   },
        // },
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
      none: {
        // targets: {
        //   bg: {
        //     inform: {
        //       width: "CONTAINER_WIDTH",
        //       height: "CONTAINER_HEIGHT",
        //     },
        //   },
        // },
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
      none: {
        // targets: {
        //   bg: {
        //     inform: {
        //       width: "CONTAINER_WIDTH",
        //       height: "CONTAINER_HEIGHT",
        //     },
        //   },
        // },
      },
    },
  },
};
// REMOVE

export type AnimationPack = any;
