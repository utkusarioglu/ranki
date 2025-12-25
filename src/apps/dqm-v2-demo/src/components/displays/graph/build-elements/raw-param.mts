import type { ICpx, IParam } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { cls } from "./utils.mts";
import { createSanitizedView } from "../../../../utils/sanitizer.mts";
import { assertTryCatchSuccess } from "_assertions";

export function traverseRawParams(root: ICpx): void {
  if (!root) {
    return;
  }
  const params = root.getRawParams();
  if (params) {
    params.forEach((p) => traverseParam(p));
  }

  root.getChildren().forEach((r) => traverseRawParams(r));
}

function traverseParam(raw: IParam | null): void {
  if (!raw) {
    return;
  }
  const node = Registry.getNode(raw);
  const root = createSanitizedView(raw);
  // Registry.registerSanitized(node.data.id, root);
  const idStringPre = root.getId();
  assertTryCatchSuccess(idStringPre, { why: "id is required" });
  const idString = idStringPre.value;
  node.data.label = "rawParam:" + idString;
  node.classes = cls("rawParam");
  const id = node.data.id;

  // TODO register param sibling relationship as well. the code below does ast-ast sibling instead so it's not the right call.

  const creatorCpxPre = root.getCpx();
  assertTryCatchSuccess(creatorCpxPre, { why: "Creator cpx required" });
  const creatorCpx = creatorCpxPre.value;
  if (creatorCpx) {
    const source = Registry.getId(creatorCpx);
    const e = Registry.getEdge(source, id);
    e.classes = cls("source-cpx", "target-rawParam");
    e.data.label = "collects";
  }
}
