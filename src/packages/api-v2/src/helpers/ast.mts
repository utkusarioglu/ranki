import type {
  RankiLangContextInstance,
  RankiLangParseHandlerCommon,
} from "../export.mjs";

export function getContext<
  T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
>(self: any): RankiLangContextInstance<T> {
  return self.args.context;
}
