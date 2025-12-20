import type { ICps } from "@dqm/package-dqm-api-v2";
import type { E, Traversal } from "./build.types";
import { Id } from "./id.mts";
import { classes } from "./utils.mts";

export function traverseCps(root: ICps, cpsDepth: number): Traversal {
  if (root === undefined) {
    return undefined;
  }
  const id = Id.getNew(root);
  const node = {
    data: {
      id,
      label: "cps:" + root.getId().getChain().join("."),
    },
    classes: classes("cps", cpsDepth === 0 && "root", `depth-${cpsDepth}`),
  };

  const cpxEdges: E[] = [];
  const creatorCpx = root.getCpx();
  cpxEdges.push({
    data: {
      source: Id.getId(creatorCpx),
      target: id,
      label: "delegates",
    },
    classes: classes("cpx-cps"),
  });

  const parentCpsEdges: E[] = [];
  const parentCps = root.getParent();
  if (parentCps) {
    parentCpsEdges.push({
      data: {
        source: Id.getId(parentCps),
        target: id,
        label: "child",
      },
      classes: classes("cps-cps"),
    });
  }

  const siblingEdges: E[] = [];
  const prevCpx = root.getPrev();
  if (prevCpx) {
    siblingEdges.push({
      data: {
        source: Id.getId(prevCpx),
        target: id,
        label: "sibling",
      },
      classes: classes("cps-cps", "sibling"),
    });
  }

  const childrenCps = root
    .getChildren()
    .map((c) => traverseCps(c, cpsDepth + 1))
    .filter((v) => !!v);

  return {
    raw: root,
    node,
    relations: {
      childrenCps,
    },
    edges: {
      cpxEdges,
      siblingEdges,
    },
  };
}
