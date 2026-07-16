import { Parser } from "expr-eval";
import type { DecodeParams } from "./decoder.types.mts";
import { ConfigEval } from "./config-eval.mts";

export const parser = new Parser();

export class ConfigDecoder {
  static async decode(p: DecodeParams): Promise<void> {
    await Promise.all([this.decodeRoot(p), this.decodeTargets(p)]);
    if (!p.block.then) return;
    await ConfigDecoder.decode({ ...p, block: p.block.then });
  }

  private static async decodeRoot(p: DecodeParams): Promise<void> {
    if (!p.block.root || !p.block.root.length) {
      return Promise.resolve();
    }
    await Promise.all(
      p.block.root.map(async (b) => {
        await p.apply({
          name: b.name,
          keyframes: b.keyframes.map((k) =>
            ConfigEval.evalKeyframe(p.curr, p.prev, p.context, k),
          ),
          options: ConfigEval.evalOptions(b, p.context),
        });
        if (!b.then) return;
        await this.decode({ ...p, block: b.then });
      }),
    );
  }
}
