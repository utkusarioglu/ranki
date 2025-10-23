import type { RankiPluginParserValidationCallback } from "@ranki/package-api-v2";
import { validationPlaceholder as placeholder } from "@ranki/package-api-v2/helpers";

export const validators: RankiPluginParserValidationCallback = () => ({
  richStructure: placeholder,
  collection: placeholder,
  volume: placeholder,
  chapter: placeholder,
  article: placeholder,
  hLevel_defined: placeholder,
});
