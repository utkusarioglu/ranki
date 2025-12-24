import type { ICpx } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { cls } from "./utils.mts";
import { createSanitizedView } from "../../../../utils/sanitizer.mts";
import { assertTryCatchSuccess } from "_assertions";

export function traverseCpx(raw: ICpx | null, cpxDepth: number): void {
  if (!raw) {
    return;
  }
  const root = createSanitizedView(raw);
  const id = Registry.getNew(raw);
  const node = {
    data: {
      id,
      label: "cpx:" + root.getChainListString().value,
    },
    classes: cls("cpx", cpxDepth === 0 && "root"),
  };
  Registry.registerNode(node);

  const parentCpxPre = root.getParent();
  assertTryCatchSuccess(parentCpxPre, { why: "parentCpx required" });
  const parentCpx = parentCpxPre.value;
  if (parentCpx) {
    if (Registry.has(parentCpx)) {
      Registry.registerEdge({
        data: {
          source: Registry.getId(parentCpx),
          target: node.data.id,
          label: "child",
        },
        classes: cls("source-cpx", "target-cpx", "parent", `depth-${cpxDepth}`),
      });
    }
  }

  const prevCpxPre = root.getPrev();
  assertTryCatchSuccess(prevCpxPre, { why: "prevCpx required" });
  const prevCpx = prevCpxPre.value;
  if (prevCpx) {
    Registry.registerEdge({
      data: {
        source: Registry.getId(prevCpx),
        target: id,
        label: "sibling",
      },
      classes: cls("source-cpx", "target-cpx", "sibling"),
    });
  }

  const childrenPre = root.getChildren();
  assertTryCatchSuccess(childrenPre, { why: "Children required" });
  childrenPre.value.forEach((r) => traverseCpx(r, cpxDepth + 1));
}
