import type { ReactiveElement } from "lit";
import type {
  AnimationRole,
  InformContext,
  InformedChildStyle,
  LocalAction,
} from "../geometry.types.mjs";
import { type InformTargetCb, type ApplyParams } from "./animator.types.mjs";
import { AnimationSequencer } from "./animatior.sequencer.mjs";
import { KeyframeUtils } from "_controllers/geometry/KeyframeUtils.mjs";
import { getAnimationRecipe } from "_store/app.getters.mjs";
import { LayoutParser } from "../parser/layout-parser.mjs";

export class Animator {
  private readonly host: ReactiveElement;
  private readonly role: AnimationRole;
  private readonly preset: string = "debug";
  private readonly informTarget: InformTargetCb;
  private runningAnimations = new Map<string, Animation>();
  private readonly sequencer: AnimationSequencer;

  constructor(
    host: ReactiveElement,
    role: AnimationRole,
    informTarget: InformTargetCb,
  ) {
    this.host = host;
    this.role = role;
    this.informTarget = informTarget;
    this.sequencer = new AnimationSequencer({
      informTarget: this.informTarget.bind(this),
      apply: this.apply.bind(this),
    });
  }

  private async apply({
    name,
    keyframes,
    options,
  }: ApplyParams): Promise<void> {
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
    const r = this.runningAnimations.get(name);
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
    this.runningAnimations.set(name, anim);
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
