import type { RankiPluginParserValidationCallback } from "@ranki/package-api-v2";
import { validationPlaceholder as placeholder } from "@ranki/package-api-v2/helpers";

export const validators: RankiPluginParserValidationCallback = () => ({
  v1Inline_p: placeholder,
});
