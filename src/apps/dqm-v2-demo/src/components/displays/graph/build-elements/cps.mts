import type { ICps } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { cls } from "./utils.mts";
import { createSanitizedView } from "../../../../utils/sanitizer.mts";
import { assertTryCatchSuccess } from "_assertions";

export function traverseCps(raw: ICps | null, cpsDepth: number): void {
  if (!raw) {
    return;
  }
  const root = createSanitizedView(raw);
  const id = Registry.getNew(raw);
  Registry.registerSanitized(id, root);
  const cpsIdStringPre = root.getIdString();
  assertTryCatchSuccess(cpsIdStringPre, { why: "Cps Id is required" });
  const cpsIdString = cpsIdStringPre.value;
  const node = {
    data: {
      id,
      label: "cps:" + cpsIdString,
    },
    classes: cls("cps", cpsDepth === 0 && "root", `depth-${cpsDepth}`),
  };
  Registry.registerNode(node);

  const creatorCpxPre = root.getCpx();
  assertTryCatchSuccess(creatorCpxPre, { why: "Creator Cpx required" });
  const creatorCpx = creatorCpxPre.value;
  Registry.registerEdge({
    data: {
      source: Registry.getId(creatorCpx),
      target: id,
      label: "delegates",
    },
    classes: cls("source-cpx", "target-cps"),
  });

  const parentCpsPre = root.getParent();
  assertTryCatchSuccess(parentCpsPre, { why: "parent cps is required" });
  const parentCps = parentCpsPre.value;
  if (parentCps) {
    Registry.registerEdge({
      data: {
        source: Registry.getId(parentCps),
        target: id,
        label: "child",
      },
      classes: cls("source-cps", "target-cps", "relationship-child"),
    });
  }

  const prevCpxPre = root.getPrev();
  assertTryCatchSuccess(prevCpxPre, { why: "previous cpx is required" });
  const prevCpx = prevCpxPre.value;
  if (prevCpx) {
    Registry.registerEdge({
      data: {
        source: Registry.getId(prevCpx),
        target: id,
        label: "sibling",
      },
      classes: cls("source-cps", "target-cps", "relationship-sibling"),
    });
  }

  const children = root.getChildren();
  assertTryCatchSuccess(children, { why: "children required" });
  children.value.forEach((n) => traverseCps(n, cpsDepth + 1));
}
