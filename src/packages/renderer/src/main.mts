import type { ApiStageTransformed, ApiStageRendered } from "@ranki/package-api";
import { Html } from "@ranki/package-html";

export function render(
  transformed: ApiStageTransformed,
): Promise<ApiStageRendered> {
  const html = new Html();
  return Promise.resolve({
    ...transformed,
    stage: "rendered",
    rendered: {
      selector: "string",
      component: "aaa",
      element: html.chain(["div", "pre"], {
        leaf: {
          format: "text",
          content: JSON.stringify(transformed.ast, null, 2),
        },
      }).root as HTMLDivElement,
    },
  });
}
