import type { RankiPluginParserValidationFunc } from "../stages/validation.mjs";

export const validationPlaceholder: RankiPluginParserValidationFunc = (n) => ({
  warnings: [["Placeholder:", n.kind, n.creator].join(" ")],
  errors: [],
});
