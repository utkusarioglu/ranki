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
import { Parser } from "expr-eval";
import type { GeometrySetName } from "../../types/geometry-controller.types.mts";
import { KeyframeParser } from "./keyframe/keyframe-parser.mjs";

export const parser = new Parser();

export class LayoutParser {
  static parse(p: ParseRootParams): LayoutParsed {
    const targets = p.block.sets
      ? this.parseSets(p.block.sets, p.curr, p.prev)
      : undefined;
    const then = p.block.then
      ? this.parse({
          block: p.block.then,
          curr: p.curr,
          prev: p.prev,
        })
      : undefined;
    return {
      root: p.block.root?.map((r) => this.parseRoot(r, p.curr, p.prev)),
      sets: targets,
      then,
    };
  }

  private static parseSet(
    setName: GeometrySetName,
    t: AnimationTarget,
    curr: ParseRootParams["curr"],
    prev: ParseRootParams["prev"] | null,
  ): LayoutSetsInform {
    const then: LayoutParsed | undefined = t.then
      ? this.parse({
          block: t.then,
          curr,
          prev,
        })
      : undefined;
    return {
      wait: KeyframeParser.evalOptionValue(curr.context, t.wait),
      props: {
        setName,
        containerExposed: {
          style: t.expose
            ? KeyframeParser.evalKeyframe(curr, prev, t.expose)
            : {},
        },
        selfOverrides: {
          style: t.override
            ? KeyframeParser.evalKeyframe(curr, prev, t.override)
            : {},
        },
      },
      then,
    };
  }

  private static parseSets(
    targets: AnimationBlockSets,
    curr: ParseRootParams["curr"],
    prev: ParseRootParams["prev"] | null,
  ): LayoutParsedSets {
    const ent = Object.entries(targets).map(([id, v]) => [
      id,
      this.parseSet(id, v, curr, prev),
    ]);
    return Object.fromEntries(ent);
  }

  private static parseRoot(
    b: AnimationRoot,
    curr: ParseRootParams["curr"],
    prev: ParseRootParams["prev"] | null,
  ): ApplyRootParams {
    return {
      apply: {
        name: b.name,
        keyframes: b.keyframes.map((k) =>
          KeyframeParser.evalKeyframe(curr, prev, k),
        ),
        options: KeyframeParser.evalOptions(b, curr.context),
      },
      then: b.then && this.parse({ curr, prev, block: b.then }),
    };
  }
}
