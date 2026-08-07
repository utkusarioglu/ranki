import type { TargetAnimationSpec } from "_controllers/geometry/controller/animator/animator.types.mjs";

export const ICON: TargetAnimationSpec = {
  "icon-span": {
    enter: {
      root: [
        {
          name: "init",
          // duration: 2000,
          duration: 0,
          keyframes: [
            {
              width: 0,
              // height: "to.container.height",
              height: "to.self.height",
              opacity: 0,
            },
          ],
        },
        {
          name: "width",
          // duration: 2000,
          duration: 0,
          keyframes: [
            {
              // width: "to.container.width",
              width: "to.self.width",
              opacity: 1,
            },
          ],
        },
      ],
    },
  },

  icon: {
    enter: {
      root: [
        {
          name: "to.self.height",
          duration: 0,
          keyframes: [
            {
              // height: "to.container.height",
              height: "to.self.height",
              // top: "to.container.top",
              // left: "to.container.left",
            },
          ],
        },
        {
          name: "width",
          // duration: 1000,
          duration: 0,
          keyframes: [
            {
              opacity: 1,
              // width: "to.container.width",
              width: "to.self.width",
            },
          ],
        },
      ],
      sets: {
        "icon-span": {
          expose: {
            // width: "to.container.width",
            width: "to.self.width",
            // height: "to.container.height",
            height: "to.self.height",
          },
        },
      },
    },
    move: {
      root: [
        {
          name: "position",
          duration: 0,
          keyframes: [
            {
              height: "to.container.height",
              top: "to.container.top",
              left: "to.container.left",
            },
          ],
        },
        // {
        //   name: "width",
        //   // duration: 1000,
        //   duration: 0,
        //   keyframes: [
        //     {
        //       opacity: 1,
        //       width: "to.container.width",
        //     },
        //   ],
        // },
      ],
    },
    resize: {
      root: [
        // {
        //   name: "to.self.height",
        //   duration: 0,
        //   keyframes: [
        //     {
        //       height: "to.container.height",
        //       // top: "to.container.top",
        //       // left: "to.container.left",
        //     },
        //   ],
        // },
        {
          name: "width",
          // duration: 1000,
          duration: 0,
          keyframes: [
            {
              opacity: 1,
              width: "to.container.width",
            },
          ],
        },
      ],
      sets: {
        children: {
          expose: {
            width: "to.container.width",
            height: "to.container.height",
          },
        },
      },
    },
    leave: {
      root: [
        {
          name: "exit",
          // duration: 1000,
          duration: 0,
          keyframes: [
            {
              opacity: 0,
              width: 0,
            },
          ],
        },
      ],
    },
  },
};
