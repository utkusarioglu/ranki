import type {
  ApplyRootParams,
  DecodeParams,
  LayoutParsed,
  LayoutParsedTargets,
} from "../controllers/geometry/animator/geometry.animator.types.mjs";
import { TimingUtils } from "_utils/timing,utils.mjs";
import { LayoutParser } from "../controllers/geometry/parser/layout-parser.mts";

export class AnimatorUtils {
  // static async decode(p: DecodeParams): Promise<void> {
  //   const parsed = LayoutParser.parse(p);
  //   console.log("p", parsed);

  //   await Promise.all([
  //     AnimatorUtils.decodeRoot(p),
  //     AnimatorUtils.decodeTargets(p),
  //   ]);
  //   if (!p.block.then) return;
  //   await AnimatorUtils.decode({ ...p, block: p.block.then });
  // }

  // private static async decodeTargets(p: DecodeParams): Promise<void> {
  //   if (!p.block.targets) {
  //     return Promise.resolve();
  //   }
  //   const targetsParsed = LayoutParser.parseTargets(
  //     p.block.targets,
  //     p.curr,
  //     p.prev,
  //     p.context,
  //   );

  //   if (!targetsParsed) return;
  //   await Promise.all(
  //     Object.values(targetsParsed).map(async ({ wait, target, then }) => {
  //       if (wait) await TimingUtils.delay(wait);
  //       await p.informTarget(target);
  //       if (then) console.log("then");
  //     }),
  //   );
  //   // await Promise.all(
  //   //   Object.entries(p.block.targets).map(
  //   //     async ([id, { wait, inform, then }]) => {
  //   //       if (wait) {
  //   //         const ev = LayoutParser.evalOptionValue(p.context, wait);
  //   //         await TimingUtils.delay(ev);
  //   //       }
  //   //       const informTargetParams = { id, curr: p.curr, prev: p.prev, inform };
  //   //       await p.informTarget(informTargetParams);
  //   //       if (!then) return;
  //   //       await AnimatorUtils.decode({ ...p, block: then });
  //   //     },
  //   //   ),
  //   // );
  // }

  private static async applyTargets(
    l: LayoutParsedTargets | undefined,
    apply: DecodeParams["apply"],
    informTarget: DecodeParams["informTarget"],
  ): Promise<void> {
    if (!l) return Promise.resolve();
    await Promise.all(
      Object.values(l).map(async ({ wait, target, then }) => {
        if (wait) await TimingUtils.delay(wait);
        await informTarget(target);
        if (then) await this.applyLayoutParsed(then, apply, informTarget);
        // if (then) console.log("then");
      }),
    );
  }

  // private static async decodeRoot(p: DecodeParams): Promise<void> {
  //   if (!p.block.root || !p.block.root.length) {
  //     return Promise.resolve();
  //   }
  //   await Promise.all(
  //     p.block.root.map(async (b) => {
  //       const applyParams = LayoutParser.parseRoot(
  //         b,
  //         p.curr,
  //         p.prev,
  //         p.context,
  //       );
  //       await p.apply(applyParams.apply);
  //       if (!b.then) return;
  //       await AnimatorUtils.decode({ ...p, block: b.then });
  //     }),
  //   );
  // }

  private static async applyRoots(
    roots: ApplyRootParams[] | undefined,
    apply: DecodeParams["apply"],
    informTarget: DecodeParams["informTarget"],
  ): Promise<void> {
    if (!roots) return Promise.resolve();
    await Promise.all(
      roots.map(async (p) => {
        await apply(p.apply);
        await this.applyLayoutParsed(p.then, apply, informTarget);
        // console.log("th", p.then);
        // if (p.then) await this.decode(p.then);
      }),
    );
  }

  static async applyNow(
    a: LayoutParsed | undefined,
    apply: DecodeParams["apply"],
    informTarget: DecodeParams["informTarget"],
  ): Promise<void> {
    await Promise.all([
      a && (await this.applyRoots(a.root, apply, informTarget)),
      a && (await this.applyTargets(a.targets, apply, informTarget)),
    ]);
  }

  private static async applyLayoutParsed(
    a: LayoutParsed | undefined,
    apply: DecodeParams["apply"],
    informTarget: DecodeParams["informTarget"],
  ): Promise<void> {
    if (!a) return Promise.resolve();
    await this.applyNow(a, apply, informTarget);
    await this.applyLayoutParsed(a.then, apply, informTarget);
    // apply(a.then);
  }

  static async decode(p: DecodeParams): Promise<void> {
    const parsed = LayoutParser.parse(p);
    await this.applyLayoutParsed(parsed, p.apply, p.informTarget);
    // await Promise.all([
    //   // this.applyRoots(parsed.root, p.apply),
    //   AnimatorUtils.decodeRoot(p),
    //   AnimatorUtils.decodeTargets(p),
    // ]);
    // if (!p.block.then) return;
    // await AnimatorUtils.decode({ ...p, block: p.block.then });
  }
}
