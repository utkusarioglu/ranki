import type { RankiPluginParserTransformCallback } from "@ranki/package-api-v2";
import { transformPlaceholder as placeholder } from "@ranki/package-api-v2/helpers";

export const transformers: RankiPluginParserTransformCallback = () => ({
  root_structure: placeholder,
  section_base: placeholder,
  section_empty: placeholder,
  p: placeholder,
  line: placeholder,
  lexemes: placeholder,
  decorated_base: placeholder,
  word_base: placeholder,
  clearance: placeholder,
  root_ignore: placeholder,
  word_number: placeholder,
  whitespace: placeholder,
});
