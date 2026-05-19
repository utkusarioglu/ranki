import type { ReactiveElement } from "lit";
import type {
  AnimationRole,
  InformContext,
  UpdateStyle,
} from "./geometry.types.mts";
import type {
  AnimateableStyles,
  AnimationOptions,
  AnimationPack,
  InformTargetCb,
  ImmediateStyles,
} from "./geometry.animator.types.mts";
import { TimingUtils } from "_utils/timing.mjs";

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
    console.log("update style", curr);
    const animationPack: AnimationPack = {
      expand: this.animateExpansion.bind(this),
      contract: this.animateContraction.bind(this),
      none: () => Promise.resolve(),
    };
    return animationPack[curr.main.action](curr, prev, context);
  }

  private async animateExpansion({
    top,
    left,
    width,
    height,
    lefts,
    tops,
  }: UpdateStyle): Promise<void> {
    await Promise.all([
      this.animateStyle("position", { top, left }, { duration: 1e3 }),
      TimingUtils.delay(0).then(async () => {
        // await this.bg.informStyle({ width, height, top: 0, left: 0 });
        await this.informTarget({
          target: "bg",
          curr: { tops, lefts, widths: [width], heights: [height] },
        });
      }),
      TimingUtils.delay(1000).then(
        () => this.informTarget({ target: "subtree", curr: { tops, lefts } }),
        // this.informSubtreeStyles({ tops, lefts }, this.subtree.curr.changes),
      ),
    ]);
  }

  private async animateContraction(
    { top, left, width, height, lefts, tops }: UpdateStyle,
    _prev: UpdateStyle | null,
  ): Promise<void> {
    await TimingUtils.delay(0)
      .then(
        () => this.informTarget({ target: "subtree", curr: { tops, lefts } }),
        // this.informSubtreeStyles({ tops, lefts }, this.subtree.curr.changes),
      )
      .then(() =>
        Promise.all([
          this.animateStyle("position", { top, left }, { duration: 1e3 }),
          TimingUtils.delay(0).then(() => {
            this.informTarget({
              target: "bg",
              curr: {
                widths: [width],
                heights: [height],
                lefts: [0],
                tops: [0],
              },
            });
            // return this.bg.informStyle({ width, height, top: 0, left: 0 });
          }),
        ]),
      );
  }
}
