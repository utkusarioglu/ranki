import type { IAstNode } from "@dqm/package-dqm-api-v2";
import type { E, Traversal } from "./build.types";
import { Id } from "./id.mts";
import { classes } from "./utils.mts";

/**
 * @dev
 * #1 This comes up at the very root of the graph
 */
export function traverseAst(
  root: IAstNode,
  astDepth: number,
  // relationship: string,
  // subRelationship: string,
): Traversal {
  if (!root) {
    return undefined;
  }
  const id = Id.getNew(root);
  let creator;
  try {
    creator = root.getCreator();
  } catch (e) {
    creator = "(undefined)";
  }

  const relationship = root.getRelationship() || "undefined";

  const node = {
    data: {
      id,
      label: "ast:" + creator,
    },
    classes: [
      "ast",
      `relationship-${relationship}`,
      astDepth === 0 && "root",
      `depth-${astDepth}`,
    ]
      .filter((v) => !!v)
      .join(" "),
  };

  const cpxEdges: E[] = [];
  const cpsEdges: E[] = [];
  const creatorCpx = root.getCpx();
  if (creatorCpx) {
    const headAstId = Id.getId(creatorCpx.getRootAst());
    const isHeadAst = headAstId === id;

    cpxEdges.push({
      data: {
        source: Id.getId(creatorCpx),
        target: id,
        label: "maintains",
      },
      classes: classes("cpx-ast", isHeadAst ? "head" : "secondary"),
    });

    creatorCpx.getCpsList().map((c) => {
      cpsEdges.push({
        data: {
          source: Id.getId(c),
          target: id,
          label: "cps-ast",
        },
        classes: classes("cps-ast", isHeadAst ? "head" : "secondary"),
      });
    });
  }

  const astParentEdges: E[] = [];
  const astParent = root.getParent();
  if (astParent) {
    const astParentCpx = astParent.getCpx();
    if (
      astParentCpx &&
      creatorCpx &&
      Id.getId(astParentCpx) !== Id.getId(creatorCpx)
    ) {
      astParentEdges.push({
        data: {
          source: Id.getId(astParent),
          target: id,
          label: "external",
        },
        classes: classes("ast-ast", "relationship-external"),
      });
    } else {
      astParentEdges.push({
        data: {
          source: Id.getId(astParent),
          target: id,
          label: "external",
        },
        classes: classes("ast-ast", `relationship-${relationship}`),
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
      classes: classes("ast-ast", "sibling"),
    });
  }

  const childrenNodes = root
    .getChildren()
    .map((n) => traverseAst(n, astDepth + 1))
    .filter((v) => !!v);

  return {
    raw: root,
    node,
    relations: {
      childrenNodes,
    },
    edges: {
      cpsEdges,
      cpxEdges,
      astParentEdges,
      siblingEdges,
    },
  };
}
