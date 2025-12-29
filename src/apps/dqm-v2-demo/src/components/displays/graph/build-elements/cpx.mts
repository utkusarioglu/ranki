import type { ICpx } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { cls, uniqueLabel } from "./utils.mts";
import { createSanitizedView } from "../../../../utils/sanitizer.mts";
import { assertTryCatchSuccess } from "_assertions";

export function traverseCpx(raw: ICpx | null, cpxDepth: number): void {
  if (!raw) {
    return;
  }
  const root = createSanitizedView(raw);
  const id = Registry.getNew(raw);
  Registry.registerSanitized(id, root);
  const node = {
    data: {
      id,
      label: uniqueLabel("Cpx", root.getChainListString(), root.getUnique()),
      // label: [
      //   "Cpx:",
      //   root.getChainListString().value,
      //   " (",
      //   root.getUnique().value,
      //   ")",
      // ].join(""),
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
          label: "parentOf",
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
        label: "precedes",
      },
      classes: cls("source-cpx", "target-cpx", "sibling"),
    });
  }

  const childrenPre = root.getChildren();
  assertTryCatchSuccess(childrenPre, { why: "Children required" });
  childrenPre.value.forEach((r) => traverseCpx(r, cpxDepth + 1));
}
