import type { IAstNode } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { cls } from "./utils.mts";

/**
 * @dev
 * #1 This comes up at the very root of the graph
 */
export function traverseAst(root: IAstNode | null, astDepth: number): void {
  if (!root) {
    return;
  }
  const id = Registry.getNew(root);
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
    classes: cls(
      "ast",
      `relationship-${relationship}`,
      astDepth === 0 && "root",
      `depth-${astDepth}`,
    ),
  };
  Registry.registerNode(node);

  const creatorCpx = root.getCpx();
  if (creatorCpx) {
    const headAstId = Registry.getId(creatorCpx.getRootAst());
    const isHeadAst = headAstId === id;
    Registry.registerEdge({
      data: {
        source: Registry.getId(creatorCpx),
        target: id,
        label: "maintains",
      },
      classes: cls("cpx-ast", isHeadAst ? "head" : "secondary"),
    });

    creatorCpx.getCpsList().map((c) => {
      Registry.registerEdge({
        data: {
          source: Registry.getId(c),
          target: id,
          label: "cps-ast",
        },
        classes: cls("cps-ast", isHeadAst ? "head" : "secondary"),
      });
    });
  }

  const astParent = root.getParent();
  if (astParent) {
    const astParentCpx = astParent.getCpx();
    if (
      astParentCpx &&
      creatorCpx &&
      Registry.getId(astParentCpx) !== Registry.getId(creatorCpx)
    ) {
      Registry.registerEdge({
        data: {
          source: Registry.getId(astParent),
          target: id,
          label: "external",
        },
        classes: cls("ast-ast", "relationship-external"),
      });
    } else {
      Registry.registerEdge({
        data: {
          source: Registry.getId(astParent),
          target: id,
          label: "child",
        },
        classes: cls("ast-ast", `relationship-${relationship}`),
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
      classes: cls("ast-ast", "sibling"),
    });
  }

  root.getChildren().forEach((n) => traverseAst(n, astDepth + 1));
}
