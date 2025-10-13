import type {
  RankiPluginParserValidationCallback,
  RankiPluginParserValidationFunc,
  // RankiPluginParserValidationDictionary
} from "@ranki/package-api-v2";

const placeholder: RankiPluginParserValidationFunc = (n) => ({
  warnings: [["Placeholder:", n.kind, n.type].join(" ")],
  errors: [],
});

export const validations: RankiPluginParserValidationCallback = () => ({
  root_structure: placeholder,
  section_base: placeholder,
  p: placeholder,
  line: placeholder,
  lexemes: placeholder,
  decorated_base: placeholder,
  word_base: placeholder,
  clearance: placeholder,
});
