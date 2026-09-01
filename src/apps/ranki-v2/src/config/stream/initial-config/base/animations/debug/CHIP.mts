import type { GeometryAnimationPreset } from "_controllers/geometry/controller/animator/types/library.types.mjs";

export const CHIP: GeometryAnimationPreset = {
  chip: {
    interaction: {
      hover: {
        enter: {
          sets: {
            bg: {
              override: {
                height: "= to.self.height",
                left: -10,
                width: "= to.self.width + 20",
                // backgroundColor: "#FFFFFF",
              },
            },
          },
        },
        leave: {
          sets: {
            bg: {
              override: {
                height: "= to.self.height",
                left: 0,
                width: "= to.self.width",
                // width: 100,
                // backgroundColor: "#FFFFFF",
              },
            },
          },
        },
      },
    },
    lifecycle: {
      enter: {
        root: [
          {
            duration: 0,
            keyframes: [
              {
                left: "= to.self.left",
                top: "= to.self.top",
                // width: "= to.self.width",
                // height: "= to.self.height",
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
            wait: 0,
          },
          children: {
            wait: 0,
            // override: {
            //   left: "= to.self.left",
            //   top: "= to.self.top",
            // },
            // expose: {
            // left: "= to.self.left",
            // top: "= to.self.top",
            // width: "= to.self.width",
            // height: "= to.self.height",
            // },
          },
        },
      },
      leave: {
        root: [
          {
            delay: 0,
            duration: 0,
            keyframes: [
              {
                // left: "= to.self.left",
                // top: "= to.self.top",
                width: 0,
                // height: "= to.self.height",
              },
            ],
            name: "position",
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
                height: "= to.self.height",
                left: "= to.self.left",
                top: "= to.self.top",
                width: "= to.self.width",
              },
            ],
            name: "position",
            then: {
              sets: {
                bg: {
                  override: {
                    height: "= to.self.height",
                    width: "= to.self.width",
                  },
                  wait: 0,
                },
                children: {
                  wait: 0,
                  // override: {
                  //   left: "= to.self.left",
                  //   top: "= to.self.top",
                  // },
                  // expose: {
                  // left: "= to.self.left",
                  // top: "= to.self.top",
                  // width: "= to.self.width",
                  // height: "= to.self.height",
                  // },
                },
              },
            },
          },
        ],
      },
    },
  },
};
