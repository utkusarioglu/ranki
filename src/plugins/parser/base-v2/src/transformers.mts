import type { RankiPluginParserTransformCallback } from "@ranki/package-api-v2";
import { transformPlaceholder } from "@ranki/package-api-v2/helpers";

export const transformers: RankiPluginParserTransformCallback = () => ({
  root_structure: transformPlaceholder,
  section_base: transformPlaceholder,
  section_empty: transformPlaceholder,
  p: transformPlaceholder,
  line: transformPlaceholder,
  lexemes: transformPlaceholder,
  decorated_base: transformPlaceholder,
  word_base: transformPlaceholder,
  clearance: transformPlaceholder,
  root_ignore: transformPlaceholder,
  word_number: transformPlaceholder,
});
