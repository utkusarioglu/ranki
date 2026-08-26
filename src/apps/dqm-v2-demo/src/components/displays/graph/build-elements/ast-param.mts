import type { IAstParamNode, ICpx } from "@dqm/package-dqm-api-v2";

import { assertTryCatchSuccess } from "_assertions";
import { createSanitizedView } from "@dqm/package-dqm-v2-debug";

import { Registry } from "./registry.mts";
import { cls, uniqueLabel } from "./utils.mts";

export function traverseAstParams(root: ICpx): void {
  if (!root) {
    return;
  }
  const params = root.getAstParams();
  if (params) {
    params.forEach((p) => traverseAstParam(p));
  }

  root.getCpxEdges().forEach((r) => traverseAstParams(r));
}

function traverseAstParam(raw: IAstParamNode | null): void {
  if (!raw) {
    return;
  }
  const node = Registry.getNode(raw);
  const root = createSanitizedView(raw);
  node.data.label = uniqueLabel(
    "AstParam",
    root.getIdString(),
    raw.getUnique(),
  );
  node.classes = cls("astParam");
  const id = node.data.id;

  // TODO register param sibling relationship as well. the code below does ast-ast sibling instead so it's not the right call.

  const creatorCpxPre = root.getCpx();
  assertTryCatchSuccess(creatorCpxPre, { why: "Creator cpx required" });
  const creatorCpx = creatorCpxPre.value;
  if (creatorCpx) {
    // const source = Registry.getId(creatorCpx);

    Registry.registerEdge({
      classes: cls(
        "source-cpx",
        "target-astParam",
        // `total-depth-${totalAstDepth}`,
        // isHeadAst ? "head" : "extension",
      ),
      data: {
        label: "aggregates",
        source: Registry.getId(creatorCpx),
        target: id,
      },
    });

    // const e = Registry.getEdge(source, id);
    // e.classes = cls("source-cpx", "target-astParam");
    // e.data.label = "collects";
  }
}
