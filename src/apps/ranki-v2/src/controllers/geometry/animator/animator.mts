import type { ReactiveElement } from "lit";
import type { InformContext, InformedChildStyle } from "../geometry.types.mjs";
import type { LocalAction } from "../geometry-intent.types.mts";
import type { GeometryRole } from "../controller/geometry-decorator.constructor.types.mts";
import { type AnimatorPlayParams } from "./animator.types.mjs";
import { type AnimatorCallbacks } from "./animator.constructor.types.mjs";
import { AnimationSequencer } from "./sequencer/animation-sequencer.mjs";
import { KeyframeUtils } from "_controllers/geometry/animator/keyframe/keyframe-utils.mjs";
import { getAnimationRecipe } from "_store/app.getters.mjs";
import { LayoutParser } from "../parser/layout-parser.mjs";

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
      informTarget: this.callbacks.informTarget.bind(this),
      play: this.play.bind(this),
    });
  }

  private async play({
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
    actions: LocalAction[],
    curr: InformedChildStyle,
    prev: InformedChildStyle | null,
    context: InformContext,
  ): Promise<void> {
    await Promise.all(
      actions.map((action) => {
        const block = getAnimationRecipe(action, this.preset, this.role);
        const parse = LayoutParser.parse({ block, curr, prev, context });
        return this.sequencer.build(parse);
      }),
    );
  }
}
