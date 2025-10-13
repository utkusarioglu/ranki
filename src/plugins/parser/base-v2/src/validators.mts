import type { RankiPluginParserValidationCallback } from "@ranki/package-api-v2";
import { validationPlaceholder as placeholder } from "@ranki/package-api-v2/helpers";

export const validators: RankiPluginParserValidationCallback = () => ({
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
});
