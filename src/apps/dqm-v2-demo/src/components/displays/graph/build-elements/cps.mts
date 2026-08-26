import type { ICps } from "@dqm/package-dqm-api-v2";

import { assertTryCatchSuccess } from "_assertions";
import { createSanitizedView } from "@dqm/package-dqm-v2-debug";

import { Registry } from "./registry.mts";
import { cls, uniqueLabel } from "./utils.mts";

export function traverseCps(raw: ICps | null, cpsDepth: number): void {
  if (!raw) {
    return;
  }
  const root = createSanitizedView(raw);
  const id = Registry.getNew(raw);
  Registry.registerSanitized(id, root);
  const cpsIdStringPre = root.getIdString();
  const node = {
    classes: cls("cps", cpsDepth === 0 && "root", `depth-${cpsDepth}`),
    data: {
      id,
      label: uniqueLabel("Cps", cpsIdStringPre, raw.getUnique()),
    },
  };
  Registry.registerNode(node);

  const creatorCpxPre = root.getCpx();
  assertTryCatchSuccess(creatorCpxPre, { why: "Creator Cpx required" });
  const creatorCpx = creatorCpxPre.value;
  Registry.registerEdge({
    classes: cls("source-cpx", "target-cps"),
    data: {
      label: "aggregates",
      source: Registry.getId(creatorCpx),
      target: id,
    },
  });

  const parentCpsPre = root.getCpsParent();
  assertTryCatchSuccess(parentCpsPre, { why: "parent cps is required" });
  const parentCps = parentCpsPre.value;
  if (parentCps) {
    Registry.registerEdge({
      classes: cls("source-cps", "target-cps", "relationship-child"),
      data: {
        label: "parentOf",
        source: Registry.getId(parentCps),
        target: id,
      },
    });
  }

  const prevCpxPre = root.getCpsPrev();
  assertTryCatchSuccess(prevCpxPre, { why: "previous cpx is required" });
  const prevCpx = prevCpxPre.value;
  if (prevCpx) {
    Registry.registerEdge({
      classes: cls("source-cps", "target-cps", "relationship-sibling"),
      data: {
        label: "sibling",
        source: Registry.getId(prevCpx),
        target: id,
      },
    });
  }

  const children = root.getCpsEdges();
  assertTryCatchSuccess(children, { why: "children required" });
  children.value.forEach((n) => traverseCps(n, cpsDepth + 1));
}
