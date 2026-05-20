import type { AnimationDict } from "./geometry.animator.types.mts";

export const TEMP_ANIMATION_DICT: AnimationDict = {
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
                wait: 1000,
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
  "hud-scroller": {
    expand: {
      root: [
        {
          name: "init",
          duration: 0,
          keyframes: [
            {
              height: "CONTAINER_HEIGHT",
              top: "-CONTAINER_HEIGHT",
              width: "CONTAINER_WIDTH",
            },
          ],
          then: {
            root: [
              {
                name: "size",
                duration: 1000,
                easing: "linear",
                keyframes: [
                  {
                    top: "CONTAINER_TOP",
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
                    width: 0,
                  },
                ],
              },
            ],
            targets: {
              bg: {
                wait: 1000,
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
};
// REMOVE

export type AnimationPack = any;
