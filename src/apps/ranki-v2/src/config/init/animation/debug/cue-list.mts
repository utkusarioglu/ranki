import type { TargetAnimationSpec } from "_controllers/geometry/controller/animator/animator.types.mjs";

export const CUE_LIST: TargetAnimationSpec = {
  "cue-list": {
    enter: {
      root: [
        {
          name: "init",
          // duration: 1000,
          duration: 0,
          keyframes: [
            {
              // top: "to.container.top",
              // left: "to.container.left",
              top: "to.self.top",
              left: "to.self.left",
            },
          ],
        },
      ],
      sets: {
        bg: {
          expose: {
            // width: "to.container.width",
            // height: "to.container.height",
            width: "to.self.width",
            height: "to.self.height",
          },
        },
        children: {
          // wait: 1000,
          wait: 0,
          expose: {
            top: "to.self.top",
            left: "to.self.left",
          },
        },
      },
    },
    move: {
      root: [
        {
          name: "position",
          keyframes: [
            {
              top: "to.container.top",
              left: "to.container.left",
            },
          ],
          // duration: 1000,
          duration: 0,
        },
      ],
    },
    resize: {
      // root: [
      //   {
      //     name: "position",
      //     keyframes: [
      //       {
      //         top: "to.container.top",
      //         left: "to.container.left",
      //       },
      //     ],
      //     // duration: 1000,
      //     duration: 0,
      //   },
      // ],
      sets: {
        bg: {
          expose: {
            width: "to.container.width",
            height: "to.container.height",
          },
        },
        children: {
          // wait: 1000,
          wait: 0,
          expose: {
            top: "to.self.top",
            left: "to.self.left",
          },
        },
      },
    },
    // contract: {
    //   targets: {
    //     lists: {
    //       inform: {
    //         top: "to.self.top",
    //         left: "to.self.left",
    //       },
    //       then: {
    //         root: [
    //           {
    //             name: "position",
    //             // duration: 1000,
    //             duration: 0,
    //             keyframes: [
    //               {
    //                 top: "to.container.top",
    //                 left: "to.container.left",
    //               },
    //             ],
    //           },
    //         ],
    //         targets: {
    //           bg: {
    //             // wait: 1000,
    //             inform: {
    //               width: "to.container.width",
    //               height: "to.container.height",
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
  },
};
