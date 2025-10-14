import type { RankiPluginParserTransformCallback } from "@ranki/package-api-v2";
import { transformPlaceholder as placeholder } from "@ranki/package-api-v2/helpers";

export const transformers: RankiPluginParserTransformCallback = () => ({
  integer_signed: placeholder,
  decimal_full: placeholder,
});
