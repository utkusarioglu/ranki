import type { LitElement } from "lit";

import { DebugUtils } from "_/debug/debug-utils.mjs";

import type { GeometryRole } from "../types/geometry-controller.constructor.types.mjs";
import type { CurrentAppliedStyle } from "../types/geometry-controller.types.mjs";

import {
  type AnimatorCallbacks,
  type GetCollectionConstructorParam,
} from "./animator.constructor.types.mjs";
import {
  type AnimatorPlayParams,
  type GetRecipeCallback,
} from "./animator.types.mjs";
import { type GetAnimationRecipeProps } from "./recipe/recipe.types.mjs";
import { KeyframeUtils } from "./keyframe/keyframe-utils.mjs";
import { AnimationSequencer } from "./sequencer/animation-sequencer.mjs";
import { LayoutParser } from "./parser/layout-parser.mjs";
import { RecipeUtils } from "./recipe/recipe-utils.mjs";

export class Animator<Instance extends LitElement> {
  private readonly callbacks: AnimatorCallbacks<Instance>;
  private readonly host: Instance;
  private readonly preset: string = "debug";
  private readonly role: GeometryRole;
  private running = new Map<string, Animation>();
  private readonly sequencer: AnimationSequencer;
  private readonly getRecipe: GetRecipeCallback;

  constructor(
    host: Instance,
    role: GeometryRole,
    callbacks: AnimatorCallbacks<Instance>,
  ) {
    this.host = host;
    this.role = role;
    this.callbacks = callbacks;
    this.sequencer = new AnimationSequencer({
      informSet: this.callbacks.informSet,
      playName: this.playName.bind(this),
    });
    this.getRecipe = this.prepareGetRecipeCallback(
      this.callbacks.getCollection,
    );
  }

  private prepareGetRecipeCallback(
    collectionVal: GetCollectionConstructorParam<Instance>,
  ): GetRecipeCallback {
    return typeof collectionVal === "function"
      ? (p: GetAnimationRecipeProps) =>
          RecipeUtils.getRecipeFromCollection(collectionVal(this.host), p)
      : (p: GetAnimationRecipeProps) =>
          RecipeUtils.getRecipeFromCollection(collectionVal, p);
  }

  public async update(
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
  ): Promise<void> {
    DebugUtils.animatorUpdate({ curr, host: this.host, prev });
    await Promise.all(
      curr.actions.map((action) => {
        const recipe = this.getRecipe({
          interaction: "default",
          action,
          preset: this.preset,
          role: this.role,
        });

        const parsed = LayoutParser.parse({ recipe: recipe, curr, prev });
        DebugUtils.animatorUpdateComposed({
          host: this.host,
          parsed,
          recipe,
          curr,
          prev,
        });
        return this.sequencer.build(parsed);
      }),
    );
  }

  private async playName({
    keyframes,
    name,
    options,
  }: AnimatorPlayParams): Promise<void> {
    const finalOptions: KeyframeAnimationOptions = {
      ...KeyframeUtils.OPTIONS_DEFAULTS,
      ...options,
    };
    const finalKeyframes = KeyframeUtils.produceKeyframes(keyframes);
    DebugUtils.animatorPlayName({
      host: this.host,
      finalOptions,
      finalKeyframes,
    });
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
    await anim.finished
      .then(() => this.running.delete(name))
      .catch((e) =>
        console.log("ABORT", {
          host: this.host,
          running: this.running,
          e,
          new: {
            name,
            keyframes,
            options,
          },
        }),
      );
  }
}
