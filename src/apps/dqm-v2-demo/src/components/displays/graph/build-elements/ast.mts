import type { IAstNode } from "@dqm/package-dqm-api-v2";

import { assertTryCatchSuccess } from "_assertions";
import { createSanitizedView } from "@dqm/package-dqm-v2-debug";

import { Registry } from "./registry.mts";
import { cls, uniqueLabel } from "./utils.mts";

/**
 * @dev
 * #1 This comes up at the very root of the graph
 */
export function traverseAst(raw: IAstNode | null, totalAstDepth: number): void {
  if (!raw) {
    return;
  }
  const root = createSanitizedView(raw);
  // log(root);
  const id = Registry.getNew(raw);
  Registry.registerSanitized(id, root);

  const relationship = root.getRelationship().value;
  const creatorCpxPre = root.getCpx();
  assertTryCatchSuccess(creatorCpxPre, { why: "creatorCpx expected" });
  const creatorCpx = creatorCpxPre.value;
  const headAstId = creatorCpx ? Registry.getId(creatorCpx.getRootAst()) : -1;
  const isHeadAst = headAstId === id;

  const node = {
    classes: cls(
      "ast",
      `relationship-${relationship}`,
      `total-depth-${totalAstDepth}`,
      isHeadAst ? "head" : "extension",
    ),
    data: {
      id,
      label: uniqueLabel("Ast", root.getCreator(), raw.getUnique()),
      // label: "Ast:" + creator,
    },
  };
  Registry.registerNode(node);

  if (creatorCpx) {
    // Registry.registerEdge({
    //   data: {
    //     source: Registry.getId(creatorCpx),
    //     target: id,
    //     label: "maintains",
    //   },
    //   classes: cls(
    //     "source-cpx",
    //     "target-ast",
    //     `total-depth-${totalAstDepth}`,
    //     isHeadAst ? "head" : "extension",
    //   ),
    // });

    creatorCpx.getCpsList().map((c) => {
      Registry.registerEdge({
        classes: cls(
          "source-cps",
          "target-ast",
          `total-depth-${totalAstDepth}`,
          isHeadAst ? "head" : "extension",
        ),
        data: {
          label: "composes",
          source: Registry.getId(c),
          target: id,
        },
      });
    });
  }

  const astParentPre = root.getAstParent();
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
        classes: cls(
          "source-ast",
          "target-ast",
          "relationship-external",
          `total-depth-${totalAstDepth}`,
          isHeadAst ? "head" : "extension",
        ),
        data: {
          label: "foreignParentOf",
          source: Registry.getId(astParent),
          target: id,
        },
      });
    } else {
      Registry.registerEdge({
        classes: cls(
          "source-ast",
          "target-ast",
          `relationship-${relationship}`,
          `total-depth-${totalAstDepth}`,
          isHeadAst ? "head" : "extension",
        ),
        data: {
          label: "parentOf",
          source: Registry.getId(astParent),
          target: id,
        },
      });
    }
  }

  const prevCpxPre = root.getAstPrev();
  assertTryCatchSuccess(prevCpxPre, { why: "previous cpx is required" });
  const prevCpx = prevCpxPre.value;
  if (prevCpx) {
    Registry.registerEdge({
      classes: cls(
        "source-ast",
        "target-ast",
        "relationship-sibling",
        `total-depth-${totalAstDepth}`,
        isHeadAst ? "head" : "extension",
      ),
      data: {
        label: "precedes",
        source: Registry.getId(prevCpx),
        target: id,
      },
    });
  }

  const children = root.getAstEdges();

  assertTryCatchSuccess(children, { why: "children required" });
  children.value.forEach((n) => traverseAst(n, totalAstDepth + 1));
}
