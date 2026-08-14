import type { LitElement } from "lit";

import type { GeometryRole } from "../types/geometry-controller.constructor.types.mjs";
import type { CurrentAppliedStyle } from "../types/geometry-controller.types.mjs";

import { Logger } from "../logger/logger.mjs";
import { KeyframeUtils } from "./keyframe/keyframe-utils.mjs";
import { LayoutParser } from "./parser/layout-parser.mjs";
import { RecipeUtils } from "./recipe/recipe-utils.mjs";
import { type GetAnimationRecipeProps } from "./recipe/recipe.types.mjs";
import { AnimationSequencer } from "./sequencer/animation-sequencer.mjs";
import {
  type AnimatorCallbacks,
  type GetCollectionConstructorParam,
} from "./types/animator.constructor.types.mjs";
import {
  type AnimatorPlayParams,
  type GetRecipeCallback,
} from "./types/animator.types.mjs";

export class Animator<Instance extends LitElement> {
  private readonly callbacks: AnimatorCallbacks<Instance>;
  private readonly getRecipe: GetRecipeCallback;
  private readonly host: Instance;
  private readonly preset: string = "debug";
  private readonly role: GeometryRole;
  private running = new Map<string, Animation>();
  private readonly sequencer: AnimationSequencer;

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

  public async update(
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
  ): Promise<void> {
    Logger.debug("Animator.update", { curr, host: this.host, prev });
    await Promise.all(
      curr.actions.map((action) => {
        const recipe = this.getRecipe({
          action,
          interaction: "default",
          preset: this.preset,
          role: this.role,
        });

        const parsed = LayoutParser.parse({ curr, prev, recipe: recipe });
        Logger.debug("Animator.update.composed", {
          curr,
          host: this.host,
          parsed,
          prev,
          recipe,
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
    Logger.debug("Animator.playName", {
      finalKeyframes,
      finalOptions,
      host: this.host,
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
          e,
          host: this.host,
          new: {
            keyframes,
            name,
            options,
          },
          running: this.running,
        }),
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
}
