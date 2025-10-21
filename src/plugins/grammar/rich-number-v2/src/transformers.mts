import type { RankiPluginParserTransformCallback } from "@ranki/package-api-v2";
import { transformPlaceholder as placeholder } from "@ranki/package-api-v2/helpers";

export const transformers: RankiPluginParserTransformCallback = () => ({
  integer_signed: placeholder,
  decimal_full: placeholder,
  eNotation: (t) => {
    if (t.kind === "parent") {
      throw new Error("E_NOTATION CANNOT BE A PARENT");
    }
    return {
      tag: "eNotation",
      kind: "leaf",
      creator: t.creator,
      depth: t.args.depth.total,
      print: t.print,
      source: t.source,
    };
  },
});
