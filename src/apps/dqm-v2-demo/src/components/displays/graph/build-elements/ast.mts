import type { IAstNode } from "@dqm/package-dqm-api-v2";
import { Registry } from "./registry.mts";
import { cls } from "./utils.mts";
import { createSanitizedView } from "../../../../utils/sanitizer.mts";
import { assertTryCatchSuccess } from "_assertions";

/**
 * @dev
 * #1 This comes up at the very root of the graph
 */
export function traverseAst(raw: IAstNode | null, totalAstDepth: number): void {
  if (!raw) {
    return;
  }
  // let creator;
  // try {
  //   creator = root.getCreator();
  // } catch (e) {
  //   creator = "(undefined)";
  // }
  const root = createSanitizedView(raw);
  const id = Registry.getNew(raw);
  Registry.registerSanitized(id, root);
  const creator = root.getCreator().value;

  const relationship = root.getRelationship().value;
  const creatorCpxPre = root.getCpx();
  assertTryCatchSuccess(creatorCpxPre, { why: "creatorCpx expected" });
  const creatorCpx = creatorCpxPre.value;
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

  const astParentPre = root.getParent();
  assertTryCatchSuccess(astParentPre, { why: "astParent required" });
  const astParent = astParentPre.value;
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

  const prevCpxPre = root.getPrev();
  assertTryCatchSuccess(prevCpxPre, { why: "previous cpx is required" });
  const prevCpx = prevCpxPre.value;
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

  const children = root.getChildren();
  assertTryCatchSuccess(children, { why: "children required" });
  children.value.forEach((n) => traverseAst(n, totalAstDepth + 1));
}
