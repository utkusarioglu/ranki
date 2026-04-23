/**
 * AST sanitizer module for creating debug-friendly views of AST nodes.
 *
 * This module provides functionality to sanitize AST nodes by wrapping
 * their properties and methods in try-catch blocks, and filtering the
 * results based on user preferences.
 *
 * @aidoc
 */

import type { IAstNode } from "@dqm/package-dqm-api-v2";
import type { AstNodeSanitizedTypesRecord } from "./ast.filter.types.mjs";
import { type ClassSanitizer } from "../../common/class-sanitizer/sanitizer.types.mjs";
import { tryCatch, tryCatchLeap } from "../../../utils/try-catch.mjs";
import {
  assertExists,
  assertTryCatchSuccess,
} from "../../../errors/assertions.mjs";
import { NodeFilter } from "../../common/node-filter/filter.mjs";

/**
 * Internal class for creating narrowed, sanitized views of AST nodes.
 * This class handles the filtering and data extraction based on user preferences.
 *
 * @aidoc
 */
export class AstSanitizedFiltered extends NodeFilter<
  IAstNode,
  AstNodeSanitizedTypesRecord
> {
  protected calls = {
    sourceString: () => this.node.getSourceString(),
    cpxUnique: () => {
      const cpxUnique = tryCatch("getUnique", () =>
        this.cpx(this.node).getUnique(),
      );
      return cpxUnique;
    },
    astUnique: () => this.node.getUnique(),
    inlineDepth: () => this.node.getInlineDepth(),
    blockDepth: () => this.node.getBlockDepth(),
    childIndex: () => this.node.getChildIndex(),
    meaning: () => this.node.getMeaning(),
    constructorName: () =>
      tryCatch("constructorName", () => this.node.constructor.name),
    creationMethod: () => this.node.getCreationMethod(),
    ignoredCount: () =>
      tryCatchLeap(this.node.getIgnoredNodes(), (o) => o.length),
    kind: () => this.node.getKind(),
    subtreeCount: () =>
      tryCatchLeap(this.node.getSubtreeNodes(), (o) => o.length),
    childCount: () =>
      tryCatchLeap(this.node.getChildrenNodes(), (o) => o.length),
    creator: () => this.node.getCreator(),
    idListString: () =>
      tryCatch("getUnique", () => this.cpx(this.node).getIdListString()),
    chainListString: () =>
      tryCatch("chainListString", () =>
        this.cpx(this.node).getChainListString(),
      ),
    childrenNodes: () => this.recurse(this.node.getChildrenNodes()),
    subtreeNodes: () => this.recurse(this.node.getSubtreeNodes()),
    tokenNodes: () => this.recurse(this.node.getTokenNodes()),
    spaceNodes: () => this.recurse(this.node.getSpaceNodes()),
  };

  /**
   * Safely accesses the CPX (Complex) property of the AST node.
   * Throws an assertion error if CPX is not available or null.
   * @param node - The sanitized AST node.
   * @returns The CPX instance.
   * @private
   *
   * @aidoc
   */
  private cpx(node: ClassSanitizer<IAstNode>) {
    const cpx = node.getCpx();
    assertTryCatchSuccess(cpx, {
      why: "Cpx is needed for many operations",
    });
    const value = cpx.value;
    assertExists(value, {
      why: "Cpx cannot be null for this request",
    });
    return value;
  }
}
