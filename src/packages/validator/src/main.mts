import { ApiStageParsed, ApiStageValidated } from "@ranki/package-api";

export function validate(parsed: ApiStageParsed): Promise<ApiStageValidated> {
  return Promise.resolve({
    stage: "validated",
    ast: parsed.ast,
    validated: {
      type: "fake",
      warnings: "fake",
      configuration: "fake",
      parameters: "fake",
      attributes: "fake",
      children: "fake",
      source: "fake",
    },
  });
}
