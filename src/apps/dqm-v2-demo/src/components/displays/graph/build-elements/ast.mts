import type { IAstNode } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { cls } from "./utils.mts";

/**
 * @dev
 * #1 This comes up at the very root of the graph
 */
export function traverseAst(
  root: IAstNode | null,
  totalAstDepth: number,
): void {
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
  const creatorCpx = root.getCpx();
  const headAstId = creatorCpx ? Registry.getId(creatorCpx.getRootAst()) : -1;
  const isHeadAst = headAstId === id;

  const node = {
    data: {
      id,
      label: "ast:" + creator,
    },
    classes: cls(
      "ast",
      `relationship-${relationship}`,
      `total-depth-${totalAstDepth}`,
      isHeadAst ? "head" : "extension",
    ),
  };
  Registry.registerNode(node);

  if (creatorCpx) {
    Registry.registerEdge({
      data: {
        source: Registry.getId(creatorCpx),
        target: id,
        label: "maintains",
      },
      classes: cls(
        "source-cpx",
        "target-ast",
        `total-depth-${totalAstDepth}`,
        isHeadAst ? "head" : "extension",
      ),
    });

    creatorCpx.getCpsList().map((c) => {
      Registry.registerEdge({
        data: {
          source: Registry.getId(c),
          target: id,
          label: "cps-ast",
        },
        classes: cls(
          "source-cps",
          "target-ast",
          `total-depth-${totalAstDepth}`,
          isHeadAst ? "head" : "extension",
        ),
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
        classes: cls(
          "source-ast",
          "target-ast",
          "relationship-external",
          `total-depth-${totalAstDepth}`,
          isHeadAst ? "head" : "extension",
        ),
      });
    } else {
      Registry.registerEdge({
        data: {
          source: Registry.getId(astParent),
          target: id,
          label: "child",
        },
        classes: cls(
          "source-ast",
          "target-ast",
          `relationship-${relationship}`,
          `total-depth-${totalAstDepth}`,
          isHeadAst ? "head" : "extension",
        ),
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
      classes: cls(
        "source-ast",
        "target-ast",
        "relationship-sibling",
        `total-depth-${totalAstDepth}`,
        isHeadAst ? "head" : "extension",
      ),
    });
  }

  root.getChildren().forEach((n) => traverseAst(n, totalAstDepth + 1));
}
