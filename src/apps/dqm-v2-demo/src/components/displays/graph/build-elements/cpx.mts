import type { ICpx } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { cls } from "./utils.mts";

export function traverseCpx(root: ICpx | null, cpxDepth: number): void {
  if (!root) {
    return;
  }
  const id = Registry.getNew(root);
  const node = {
    data: {
      id,
      label: "cpx:" + root.getChainListString(),
    },
    classes: cls("cpx", cpxDepth === 0 && "root"),
  };
  Registry.registerNode(node);

  const parentCpx = root.getParent();
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

  const prevCpx = root.getPrev();
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

  root.getChildren().forEach((r) => traverseCpx(r, cpxDepth + 1));
}
