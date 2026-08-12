import { Parser } from "expr-eval";

import type {
  AnimationBlockSets,
  AnimationRoot,
  AnimationTarget,
  ApplyRootParams,
  LayoutParsed,
  LayoutParsedSets,
  LayoutSetsInform,
  ParseRootParams,
} from "../../animator/animator.types.mjs";
import type { GeometrySetName } from "../../sets/sets.types.mjs";

import { KeyframeParser } from "./keyframe/keyframe-parser.mjs";

export const parser = new Parser();

export class LayoutParser {
  static parse(p: ParseRootParams): LayoutParsed {
    const targets = p.recipe.sets
      ? this.parseSets(p.recipe.sets, p.curr, p.prev)
      : undefined;
    const then = p.recipe.then
      ? this.parse({
          curr: p.curr,
          prev: p.prev,
          recipe: p.recipe.then,
        })
      : undefined;
    return {
      root: p.recipe.root?.map((r) => this.parseRoot(r, p.curr, p.prev)),
      sets: targets,
      then,
    };
  }

  private static parseRoot(
    b: AnimationRoot,
    curr: ParseRootParams["curr"],
    prev: null | ParseRootParams["prev"],
  ): ApplyRootParams {
    return {
      apply: {
        keyframes: b.keyframes.map((k) =>
          KeyframeParser.evalKeyframe(curr, prev, k),
        ),
        name: b.name,
        options: KeyframeParser.evalOptions(b, curr.context),
      },
      then: b.then && this.parse({ curr, prev, recipe: b.then }),
    };
  }

  private static parseSet(
    setName: GeometrySetName,
    t: AnimationTarget,
    curr: ParseRootParams["curr"],
    prev: null | ParseRootParams["prev"],
  ): LayoutSetsInform {
    const then: LayoutParsed | undefined = t.then
      ? this.parse({
          curr,
          prev,
          recipe: t.then,
        })
      : undefined;
    return {
      props: {
        containerExposed: {
          style: t.expose
            ? KeyframeParser.evalKeyframe(curr, prev, t.expose)
            : {},
        },
        selfOverrides: {
          interaction: curr.self.interaction,
          lifecycle: curr.self.lifecycle,
          style: t.override
            ? KeyframeParser.evalKeyframe(curr, prev, t.override)
            : {},
        },
        setName,
      },
      then,
      wait: KeyframeParser.evalOptionValue(curr.context, t.wait),
    };
  }

  private static parseSets(
    targets: AnimationBlockSets,
    curr: ParseRootParams["curr"],
    prev: null | ParseRootParams["prev"],
  ): LayoutParsedSets {
    const ent = Object.entries(targets).map(([id, v]) => [
      id,
      this.parseSet(id, v, curr, prev),
    ]);
    return Object.fromEntries(ent);
  }
}
