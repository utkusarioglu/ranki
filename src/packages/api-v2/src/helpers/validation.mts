import type { RankiPluginParserValidationFunc } from "../stages/validation.type.mjs";

export const validationPlaceholder: RankiPluginParserValidationFunc = (n) => ({
  warnings: [["Placeholder:", n.kind, n.creator].join(" ")],
  errors: [],
});
