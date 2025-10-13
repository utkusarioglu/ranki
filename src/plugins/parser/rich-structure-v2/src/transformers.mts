import type { RankiPluginParserTransformCallback } from "@ranki/package-api-v2";
import { transformPlaceholder as placeholder } from "@ranki/package-api-v2/helpers";

export const transformers: RankiPluginParserTransformCallback = () => ({
  richStructure: placeholder,
  collection: placeholder,
  volume: placeholder,
  chapter: placeholder,
  article: placeholder,
});
