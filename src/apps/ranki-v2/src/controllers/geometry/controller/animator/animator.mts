import type { LitElement } from "lit";

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
    this.o11y = new O11y(this, {
      // logger: {
      // attributes: () => ({
      //   hostTag: this.host.tagName,
      // }),
      // },
      meter: {
        histograms: {
          "play.duration": {
            unit: "ms",
          },
        },
        nameFormat: ({ name }) => `animator.${name}`,
      },
      tracer: {
        nameFormat: ({ name }) => [this.host.tagName, name].join(":"),
      },
    });
  }

  public async update(
    curr: CurrentAppliedStyle,
    prev: CurrentAppliedStyle | null,
  ): Promise<void> {
    this.o11y.devtools.log("Animator.update", { curr, host: this.host, prev });
    return this.o11y.trace.span("update", async ({ span, withCtx }) => {
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

          this.o11y.devtools.log("Animator.update.composed", {
            curr,
            host: this.host,
            parsed,
            prev,
            recipe,
          });
          return withCtx(
            {
              "geometry.action": action,
              "html.element.tag": this.host.tagName,
            },
            () => this.sequencer.build(parsed),
          );
        }),
      );
    });
  }

  private async playName({
    keyframes,
    name,
    options,
  }: AnimatorPlayParams): Promise<void> {
    return this.o11y.trace.span(`playName:${name}`, async ({ span }) => {
      try {
        const finalOptions: KeyframeAnimationOptions = {
          ...KeyframeUtils.OPTIONS_DEFAULTS,
          ...options,
        };
        const finalKeyframes = KeyframeUtils.produceKeyframes(keyframes);
        this.o11y.meter.record("play.duration", +(finalOptions.duration || 0));
        span.addEvent("keyframes.produced");
        this.o11y.log.debug("Animator.playName", { finalKeyframes });
        this.o11y.devtools.log("Animator.playName", {
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
      }
    });
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
