import type { LitElement } from "lit";

import { trace, type Tracer } from "@opentelemetry/api";

import type { GeometryRole } from "../types/geometry-controller.constructor.types.mjs";
import type { CurrentAppliedStyle } from "../types/geometry-controller.types.mjs";

import { O11y } from "../../o11y/o11y.mjs";
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
  private readonly o11y: O11y<this>;
  private readonly preset: string = "debug";
  private readonly role: GeometryRole;
  private running = new Map<string, Animation>();
  private readonly sequencer: AnimationSequencer;
  private readonly tracer: Tracer;

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
    this.tracer = trace.getTracer(this.constructor.name);
    this.o11y = new O11y(this, {
      logger: {
        host: this.host,
      },
    });
  }

  public async update(
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
  ): Promise<void> {
    this.o11y.log.debug("Animator.update", { curr, host: this.host, prev });
    return this.tracer.startActiveSpan(
      `${this.host.tagName}:update`,
      async (span) => {
        try {
          await Promise.all(
            curr.actions.map((action) => {
              span.addEvent("animator.recipe.get");
              const recipe = this.getRecipe({
                action,
                interaction: "default",
                preset: this.preset,
                role: this.role,
              });
              span.addEvent("animator.recipe.ready");

              const parsed = LayoutParser.parse({ curr, prev, recipe: recipe });
              span.addEvent("animator.layout.parsed");

              this.o11y.log.debug("Animator.update.composed", {
                curr,
                host: this.host,
                parsed,
                prev,
                recipe,
              });
              return this.sequencer.build(parsed, {
                action,
                tag: this.host.tagName,
              });
            }),
          );
        } finally {
          span.end();
        }
      },
    );
  }

  private async playName({
    keyframes,
    name,
    options,
  }: AnimatorPlayParams): Promise<void> {
    return this.tracer.startActiveSpan(
      `${this.host.tagName}:playName:${name}`,
      async (span) => {
        try {
          const finalOptions: KeyframeAnimationOptions = {
            ...KeyframeUtils.OPTIONS_DEFAULTS,
            ...options,
          };
          const finalKeyframes = KeyframeUtils.produceKeyframes(keyframes);
          span.addEvent("keyframes.produced");
          this.o11y.log.debug("Animator.playName", {
            finalKeyframes,
            finalOptions,
            host: this.host,
          });
          span.addEvent("host.animate.start");
          const anim = this.host.animate(finalKeyframes, finalOptions);

          span.addEvent("host.animate.end");
          const r = this.running.get(name);
          if (r) {
            span.addEvent("animation.cancel");
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
          this.running.delete(name);
          span.addEvent("animation.delete");
        } catch (e) {
          console.log("ABORT", {
            e,
            host: this.host,
            new: {
              keyframes,
              name,
              options,
            },
            running: this.running,
          });
        } finally {
          span.end();
        }
      },
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
