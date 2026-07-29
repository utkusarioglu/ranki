import type { ReactiveElement } from "lit";
import { type AnimatorPlayParams } from "./animator.types.mjs";
import { type AnimatorCallbacks } from "./animator.constructor.types.mjs";
import { AnimationSequencer } from "./sequencer/animation-sequencer.mjs";
import { getAnimationRecipe } from "_store/app.getters.mjs";
import { LayoutParser } from "./parser/layout-parser.mjs";
import { DEBUG_TAG } from "_/debug.constants.mjs";
import type { GeometryRole } from "../geometry-decorator.constructor.types.mjs";
import { KeyframeUtils } from "./keyframe/keyframe-utils.mjs";
import type { CurrentAppliedStyle } from "../geometry-controller.types.mjs";

export class Animator {
  private readonly host: ReactiveElement;
  private readonly role: GeometryRole;
  private readonly sequencer: AnimationSequencer;
  private readonly callbacks: AnimatorCallbacks;
  private readonly preset: string = "debug";
  private running = new Map<string, Animation>();

  constructor(
    host: ReactiveElement,
    role: GeometryRole,
    callbacks: AnimatorCallbacks,
  ) {
    this.host = host;
    this.role = role;
    this.callbacks = callbacks;
    this.sequencer = new AnimationSequencer({
      informTarget: this.callbacks.informSet.bind(this),
      playName: this.playName.bind(this),
    });
  }

  private async playName({
    name,
    keyframes,
    options,
  }: AnimatorPlayParams): Promise<void> {
    const finalOptions: KeyframeAnimationOptions = {
      // easing: "linear",
      easing: "ease-in-out",
      // easing: "cubic-bezier(0.6, -1, 0.2, 2.4)",
      fill: "both",
      ...options,
    };
    const finalKeyframes = keyframes.map((k) =>
      KeyframeUtils.produceKeyframe(k),
    );
    const anim = this.host.animate(finalKeyframes, finalOptions);
    const r = this.running.get(name);
    if (r) {
      r.oncancel = (_ev) => {
        if (r.playState === "running") {
          console.warn(
            "Animation cancelled while running.",
            "Name: ",
            name,
            "tag: ",
            this.host.tagName,
          );
        }
      };
      r.commitStyles();
      r.cancel();
    }
    this.running.set(name, anim);
    await anim.finished;
  }

  public async updateStyle(
    // actions: LocalAction[],
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
  ): Promise<void> {
    if (this.host.tagName === DEBUG_TAG)
      console.log("animator.updateStyle", { curr, prev });

    await Promise.all(
      curr.actions.map((action) => {
        const block = getAnimationRecipe(action, this.preset, this.role);
        const parse = LayoutParser.parse({ block, curr, prev });
        if (this.host.tagName === DEBUG_TAG)
          console.log("animator.updateStyle.loop", { block, parse });
        return this.sequencer.build(parse);
      }),
    );
  }
}
