import { ApiStageValidated, ApiStageTransformed } from "@ranki/package-api";

export function transform(
  validated: ApiStageValidated,
): Promise<ApiStageTransformed> {
  return Promise.resolve({
    ...validated,
    stage: "transformed",
    transformed: {
      tag: "tag",
      classNames: "many",
      styles: "many",
      children: "many",
    },
  });
}
