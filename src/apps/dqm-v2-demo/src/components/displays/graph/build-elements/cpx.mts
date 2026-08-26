import type { ICpx } from "@dqm/package-dqm-api-v2";

import { assertTryCatchSuccess } from "_assertions";
import { createSanitizedView } from "@dqm/package-dqm-v2-debug";

import { Registry } from "./registry.mts";
import { cls, uniqueLabel } from "./utils.mts";

export function traverseCpx(raw: ICpx | null, cpxDepth: number): void {
  if (!raw) {
    return;
  }
  const root = createSanitizedView(raw);
  const id = Registry.getNew(raw);
  Registry.registerSanitized(id, root);
  const node = {
    classes: cls("cpx", cpxDepth === 0 && "root"),
    data: {
      id,
      label: uniqueLabel("Cpx", root.getChainListString(), raw.getUnique()),
    },
  };
  Registry.registerNode(node);

  const parentCpxPre = root.getCpxParent();
  assertTryCatchSuccess(parentCpxPre, { why: "parentCpx required" });
  const parentCpx = parentCpxPre.value;
  if (parentCpx) {
    Registry.registerEdge({
      classes: cls("source-cpx", "target-cpx", "parent", `depth-${cpxDepth}`),
      data: {
        label: "parentOf",
        source: Registry.getId(parentCpx),
        target: node.data.id,
      },
    });
  }

  const prevCpxPre = root.getCpxPrev();
  assertTryCatchSuccess(prevCpxPre, { why: "prevCpx required" });
  const prevCpx = prevCpxPre.value;
  if (prevCpx) {
    Registry.registerEdge({
      classes: cls("source-cpx", "target-cpx", "sibling"),
      data: {
        label: "precedes",
        source: Registry.getId(prevCpx),
        target: id,
      },
    });
  }

  const childrenPre = root.getCpxEdges();
  assertTryCatchSuccess(childrenPre, { why: "Children required" });
  childrenPre.value.forEach((r) => traverseCpx(r, cpxDepth + 1));
}
