import type { TargetAnimationSpec } from "_controllers/geometry/animator/geometry.animator.types.mjs";

export const BADGE_LIST: TargetAnimationSpec = {
  "badge-list": {
    enter: {
      root: [
        {
          name: "init",
          keyframes: [
            {
              top: "TOP",
              left: "LEFT",
            },
          ],
          // delay: 0,
          // duration: 1000,
          duration: 0,
        },
      ],
      targets: {
        bg: {
          // wait: 0,
          inform: {
            width: "CONTAINER_WIDTH",
            height: "CONTAINER_HEIGHT",
          },
        },
        chips: {
          // wait: 1000,
          // wait: 0,
          inform: {
            top: "TOP",
            left: "LEFT",
            width: "WIDTH",
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
              top: "TOP",
              left: "LEFT",
            },
          ],
          delay: 0,
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
      //         top: "TOP",
      //         left: "LEFT",
      //       },
      //     ],
      //     delay: 0,
      //     // duration: 1000,
      //     duration: 0,
      //   },
      // ],
      targets: {
        bg: {
          wait: 0,
          inform: {
            width: "CONTAINER_WIDTH",
            height: "CONTAINER_HEIGHT",
          },
        },
        chips: {
          // wait: 1000,
          wait: 0,
          inform: {
            top: "TOP",
            left: "LEFT",
            width: "WIDTH",
          },
        },
      },
    },
    // contract: {
    //   targets: {
    //     chips: {
    //       inform: {
    //         top: "TOP",
    //         left: "LEFT",
    //         width: "WIDTH",
    //       },
    //       then: {
    //         root: [
    //           {
    //             name: "position",
    //             keyframes: [
    //               {
    //                 top: "CONTAINER_TOP",
    //                 left: "CONTAINER_LEFT",
    //               },
    //             ],
    //             // duration: 1000,
    //             duration: 0,
    //           },
    //         ],
    //         targets: {
    //           bg: {
    //             wait: 0,
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
  },
};
