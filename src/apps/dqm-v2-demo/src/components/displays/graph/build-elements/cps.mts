import type { ICps } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { classes } from "./utils.mts";

export function traverseCps(root: ICps | null, cpsDepth: number): void {
  if (!root) {
    return;
  }
  const id = Registry.getNew(root);
  const node = {
    data: {
      id,
      label: "cps:" + root.getId().getChain().join("."),
    },
    classes: classes("cps", cpsDepth === 0 && "root", `depth-${cpsDepth}`),
  };
  Registry.registerNode(node);

  const creatorCpx = root.getCpx();
  Registry.registerEdge({
    data: {
      source: Registry.getId(creatorCpx),
      target: id,
      label: "delegates",
    },
    classes: classes("cpx-cps"),
  });

  const parentCps = root.getParent();
  if (parentCps) {
    Registry.registerEdge({
      data: {
        source: Registry.getId(parentCps),
        target: id,
        label: "child",
      },
      classes: classes("cps-cps", "relationship-child"),
    });
  }

  const prevCpx = root.getPrev();
  if (prevCpx) {
    Registry.registerEdge({
      data: {
        source: Registry.getId(prevCpx),
        target: id,
        label: "sibling",
      },
      classes: classes("cps-cps", "relationship-sibling"),
    });
  }

  root.getChildren().forEach((c) => traverseCps(c, cpsDepth + 1));
}
