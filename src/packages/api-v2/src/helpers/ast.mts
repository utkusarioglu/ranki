import type { RankiLangContextInstance } from "../export.mjs";

export function getContext(self: any): RankiLangContextInstance {
  return self.args.context;
}
