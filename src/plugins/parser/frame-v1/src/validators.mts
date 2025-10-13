import type {
  RankiPluginParserValidationCallback,
  RankiPluginParserValidationFunc,
  // RankiPluginParserValidationDictionary
} from "@ranki/package-api-v2";

const placeholder: RankiPluginParserValidationFunc = (n) => ({
  warnings: [["Placeholder:", n.kind, n.type].join(" ")],
  errors: [],
});

export const validators: RankiPluginParserValidationCallback = () => ({});
