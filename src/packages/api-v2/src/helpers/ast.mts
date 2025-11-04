import type { RankiLangContextInstance } from "../export.type.mjs";

export function getContext(self: any): RankiLangContextInstance {
  return self.args.context;
}
