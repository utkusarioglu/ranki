import type { ICpx, IParam } from "@dqm/package-dqm-api-v2";
import type { E, Traversal, TraversalNode } from "./build.types";
import { Id } from "./id.mts";
import { classes } from "./utils.mts";

export function traverseParams(root: ICpx): Traversal {
  const params = root.getParams();
  let childrenParams: TraversalNode[] = [];
  if (params) {
    childrenParams = params.map((p) => traverseParam(p)).filter((v) => !!v);
  }

  const childrenCpx = root
    .getChildren()
    .map((r) => traverseParams(r))
    .filter((v) => !!v);

  return {
    raw: root,
    node: null,
    relations: {
      childrenCpx,
      childrenParams,
    },
    edges: {
      // parentEdges,
      // siblingEdges,
    },
  };
}

function traverseParam(root: IParam): Traversal {
  if (!root) {
    return undefined;
  }
  const id = Id.getNew(root);
  const elem = Id.getSource(id);
  console.log("elem", elem);
  const node = {
    data: {
      id,
      label: "param:" + root.getId().getId().join("."),
    },
    classes: classes("param"),
  };

  const cpxEdges: E[] = [];
  const cpsEdges: E[] = [];
  const creatorCpx = root.getCpx();
  if (creatorCpx) {
    const source = Id.getId(creatorCpx);
    cpxEdges.push({
      data: {
        source,
        target: id,
        label: "customizes",
      },
      classes: classes("cpx-param"),
    });

    creatorCpx.getCpsList().forEach((n) => {
      cpsEdges.push({
        data: {
          source: Id.getId(n),
          target: id,
          label: "customizes2",
        },
        classes: classes("cps-param"),
      });
    });
  }

  return {
    raw: root,
    node,
    relations: {},
    edges: {
      cpxEdges,
      cpsEdges,
    },
  };
}
