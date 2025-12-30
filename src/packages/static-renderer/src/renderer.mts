import type {
  DqmTransformOutput,
  IDqmRenderer,
  RenderReport,
  RenderRoots,
} from "@dqm/package-dqm-api-v2";
import { assertExists } from "./error/assertions.mjs";

export class DqmStaticRenderer implements IDqmRenderer {
  render(trn: DqmTransformOutput, roots: RenderRoots): RenderReport {
    trn.forEach(({ theater, trn }) => {
      const root = roots[theater];
      assertExists(root, {
        why: "Each theater requires a matching render root",
      });
      const elem = document.createElement("div");
      elem.innerText = trn
        .map((t) => {
          switch (t.kind) {
            case "parent":
              return "parent";
            case "leaf":
              return t.source;
          }
        })
        .join("\n\n");
      root.appendChild(elem);
    });
    return {};
  }
}
