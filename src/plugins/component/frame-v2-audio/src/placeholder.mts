import type { ComponentPluginValidationFunc } from "@ranki/package-api-v2";

export const placeholder: ComponentPluginValidationFunc = (validation) => ({
  warnings: [["CODE_COMPONENT VALIDATION", validation.kind].join(" ")],
  errors: [],
});
