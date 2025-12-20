import type { ICpx } from "@dqm/package-dqm-api-v2";
import type { E, Traversal } from "./build.types";
import { Id } from "./id.mts";
import { classes } from "./utils.mts";

export function traverseCpx(root: ICpx, cpxDepth: number): Traversal {
  if (!root) {
    return undefined;
  }
  const id = Id.getNew(root);
  const node = {
    data: {
      id,
      label:
        "cpx:" +
        root
          .getChainList()
          .map((v) => v.join("."))
          .join(" | "),
    },
    classes: classes("cpx", cpxDepth === 0 && "root"),
  };

  const parentEdges: E[] = [];
  const parentCpx = root.getParent();
  if (parentCpx) {
    if (Id.has(parentCpx)) {
      parentEdges.push({
        data: {
          source: Id.getId(parentCpx),
          target: node.data.id,
          label: "child",
        },
        classes: classes("cpx-cpx", "parent", `depth-${cpxDepth}`),
      });
    }
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
      classes: classes("cpx-cpx", "sibling"),
    });
  }

  const childrenCpx = root
    .getChildren()
    .map((r) => traverseCpx(r, cpxDepth + 1))
    .filter((v) => !!v);

  return {
    raw: root,
    node,
    relations: {
      childrenCpx,
    },
    edges: {
      parentEdges,
      siblingEdges,
    },
  };
}
