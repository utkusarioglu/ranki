import type { ApiStageValidated, ApiStageRendered } from "@ranki/package-api";
import { Html } from "@ranki/package-html";

export function render(
  validated: ApiStageValidated,
): Promise<ApiStageRendered> {
  const html = new Html();
  return Promise.resolve({
    stage: "rendered",
    element: html.single("pre", {
      format: "text",
      content: JSON.stringify(validated.ast, null, 2),
    }),
  });
}
