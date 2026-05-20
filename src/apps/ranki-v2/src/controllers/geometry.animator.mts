import type { ReactiveElement } from "lit";
import type {
  AnimationRole,
  InformContext,
  LocalAction,
  UpdateStyle,
} from "./geometry.types.mts";
import {
  type AnimateableStyles,
  type AnimationOptions,
  type InformTargetCb,
  type ImmediateStyles,
  type AnimationBlock,
  type AnimateableStylesConfigKeyframes,
} from "./geometry.animator.types.mts";
import { TEMP_ANIMATION_DICT } from "./TEMP_ANIMATION_DICT.mts";
import { TimingUtils } from "_utils/timing.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";

export class Animator {
  private readonly host: ReactiveElement;
  private readonly role: AnimationRole;
  private readonly informTarget: InformTargetCb;
  private runningAnimations = new Map<string, Animation>();

  constructor(
    host: ReactiveElement,
    role: AnimationRole,
    informTarget: InformTargetCb,
  ) {
    this.host = host;
    this.role = role;
    this.informTarget = informTarget;
  }

  setStyle({ width, height, opacity, left, top, zIndex }: ImmediateStyles) {
    this.host.style.setProperty("z-index", "" + zIndex);
    this.animateStyle(
      "set-style",
      {
        width,
        height,
        opacity,
        left,
        top,
      },
      { duration: 0 },
    );
    return this;
  }

  public animateStyle(
    name: string,
    pos: AnimateableStyles,
    options: AnimationOptions,
    whenDone?: () => void,
  ) {
    let transform = {};
    const hasLeft = pos.left !== undefined;
    const hasTop = pos.top !== undefined;
    if (hasLeft || hasTop) {
      const maybe = [
        hasLeft ? "translateX(" + pos.left + "px)" : undefined,
        hasTop ? "translateY(" + pos.top + "px)" : undefined,
      ]
        .filter((v) => !!v)
        .join(" ");
      if (maybe.length) {
        transform = { transform: maybe };
      }
    }
    const anim = this.host.animate(
      {
        ...transform,
        ...(pos.width !== undefined ? { width: pos.width + "px" } : {}),
        ...(pos.height !== undefined ? { height: pos.height + "px" } : {}),
        ...(pos.opacity !== undefined ? { opacity: pos.opacity } : {}),
      },
      {
        // easing: "linear",
        easing: "ease-in-out",
        // easing: "cubic-bezier(0.6, -1, 0.2, 2.4)",
        fill: "both",
        ...options,
      },
    );
    const r = this.runningAnimations.get(name);
    r?.commitStyles();
    r?.cancel();
    this.runningAnimations.set(name, anim);
    anim.finished
      .then(() => {
        whenDone && whenDone();
      })
      .catch(() => {});
    return this;
  }

  public async updateStyle(
    curr: UpdateStyle,
    prev: UpdateStyle | null,
    context: InformContext,
  ): Promise<void> {
    const recipe = this.getRecipe(curr.main.action);
    return this.decode(curr, prev, context, recipe);
  }

  private getRecipe(action: LocalAction) {
    if (action === "none") return {};
    const roleDict = TEMP_ANIMATION_DICT[this.role];
    assertNotUndefined(roleDict, {
      why: "No animation for this role exists",
      details: { role: this.role },
    });
    const recipe = roleDict[action];
    assertNotUndefined(recipe, {
      why: "No recipe for this role exists",
      details: { role: this.role, action },
    });
    return recipe;
  }

  private async decode(
    curr: UpdateStyle,
    prev: UpdateStyle | null,
    context: InformContext,
    block: AnimationBlock,
  ): Promise<void> {
    return Promise.all([
      block.root &&
        !!block.root.length &&
        Promise.all(
          block.root.map(
            (b) =>
              new Promise<void>((resolve) =>
                this.animateStyle(
                  b.name,
                  evalKeyframe(curr, prev, context, b.keyframes[0]),
                  {
                    delay: b.delay,
                    duration: b.duration,
                    easing: b.easing,
                  },
                  () =>
                    b.then &&
                    this.decode(curr, prev, context, b.then).then(() =>
                      resolve(),
                    ),
                ),
              ),
          ),
        ),
      block.targets &&
        Promise.all(
          Object.entries(block.targets).map(([id, props]) =>
            TimingUtils.delay(props.wait || 0).then(() =>
              this.informTarget({
                target: id,
                curr,
                prev,
                inform: props.inform,
                // curr: props.inform,
                // curr: evalKeyframe(curr, prev, context, props.inform),
                // curr: {
                //   height: curr.height,
                //   width: curr.width,
                //   tops: curr.tops,
                //   lefts: curr.lefts,
                //   // ...props,
                // },
              }).then(
                () =>
                  props.then && this.decode(curr, prev, context, props.then),
              ),
            ),
          ),
        ),
    ])
      .then(() => block.then && this.decode(curr, prev, context, block.then))
      .catch(console.log);
  }

  // private async animateExpansion({
  //   top,
  //   left,
  //   width,
  //   height,
  //   lefts,
  //   tops,
  // }: UpdateStyle): Promise<void> {
  //   await Promise.all([
  //     this.animateStyle("position", { top, left }, { duration: 1e3 }),
  //     TimingUtils.delay(0).then(async () => {
  //       // await this.bg.informStyle({ width, height, top: 0, left: 0 });
  //       await this.informTarget({
  //         target: "bg",
  //         curr: { tops, lefts, widths: [width], heights: [height] },
  //       });
  //     }),
  //     TimingUtils.delay(1000).then(
  //       () => this.informTarget({ target: "chips", curr: { tops, lefts } }),
  //       // this.informSubtreeStyles({ tops, lefts }, this.subtree.curr.changes),
  //     ),
  //   ]);
  // }

  // private async animateContraction(
  //   { top, left, width, height, lefts, tops }: UpdateStyle,
  //   _prev: UpdateStyle | null,
  // ): Promise<void> {
  //   await TimingUtils.delay(0)
  //     .then(
  //       () => this.informTarget({ target: "chips", curr: { tops, lefts } }),
  //       // this.informSubtreeStyles({ tops, lefts }, this.subtree.curr.changes),
  //     )
  //     .then(() =>
  //       Promise.all([
  //         this.animateStyle("position", { top, left }, { duration: 1e3 }),
  //         TimingUtils.delay(0).then(() => {
  //           this.informTarget({
  //             target: "bg",
  //             curr: {
  //               widths: [width],
  //               heights: [height],
  //               lefts: [0],
  //               tops: [0],
  //             },
  //           });
  //           // return this.bg.informStyle({ width, height, top: 0, left: 0 });
  //         }),
  //       ]),
  //     );
  // }
}

import { Parser } from "expr-eval";

const parser = new Parser();

export function evalKeyframe(
  curr: UpdateStyle,
  prev: UpdateStyle | null,
  context: InformContext,
  b: AnimateableStylesConfigKeyframes,
) {
  return Object.fromEntries(
    Object.entries(b).map(([k, v]) => [k, evaluate(curr, prev, context, v)]),
  );
}

function evaluate(
  curr: UpdateStyle,
  prev: UpdateStyle | null,
  context: InformContext,
  v: string | number | undefined,
) {
  if (typeof v === "number" || typeof v === "undefined") {
    return v;
  } else {
    const exp = parser.parse(v);
    const varSet = {
      CONTAINER_HEIGHT: curr.height,
      CONTAINER_TOP: curr.top,
      CONTAINER_WIDTH: curr.width,
      CONTAINER_LEFT: curr.left,
      LEFT: curr.lefts[context.index],
      TOP: curr.tops[context.index],
      HEIGHT: curr.heights ? curr.heights[context.index] : 0,
      WIDTH: curr.widths ? curr.widths[context.index] : 0,
      CONTAINER_PREV_HEIGHT: prev?.height || 0,
      CONTAINER_PREV_WIDTH: prev?.width || 0,
    };
    return exp.evaluate(varSet);
  }
}
