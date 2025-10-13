import type { RankiPluginParserValidationCallback } from "@ranki/package-api-v2";
import { validationPlaceholder as placeholder } from "@ranki/package-api-v2/helpers";

export const validators: RankiPluginParserValidationCallback = () => ({
  textual: placeholder,
  decorated_decorated: placeholder,
  decorated_richTextBase: placeholder,
  decorated_fallback: placeholder,
  text_propercase: placeholder,
  text_lowercase: placeholder,
  text_uppercase: placeholder,
  sentence: placeholder,
  tRichTextV2DecorationBold: placeholder,
});
