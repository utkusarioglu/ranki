import type { ApiStageTransformed, ApiStageRendered } from "@ranki/package-api";
import { Html } from "@ranki/package-html";
import yaml from "yaml";

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
          className: "some class name",
          format: "text",
          content: yaml.stringify(transformed),
        },
      }).root as HTMLDivElement,
    },
  });
}
