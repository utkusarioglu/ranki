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
import type {
  AstNodeSanitizedFilteredSanitizedKey,
  AstNodeSanitizedFilterCallRecord,
  AstNodeFilterKeys,
  AstNodeFiltersRecord,
  AstNodeSanitizedFilteredFields,
} from "./ast.filter.types.mjs";
import { createSanitizedView } from "../../common/class-sanitizer/sanitizer.mjs";
import { type ClassSanitizer } from "../../common/class-sanitizer/sanitizer.types.mjs";
import {
  tryCatch,
  tryCatchLeap,
  type TryCatch,
} from "../../../utils/try-catch.mjs";
import {
  assertExists,
  assertTryCatchSuccess,
} from "../../../errors/assertions.mjs";

/**
 * Internal class for creating narrowed, sanitized views of AST nodes.
 * This class handles the filtering and data extraction based on user preferences.
 *
 * @aidoc
 */
export class AstSanitizedFiltered {
  /** The sanitized AST node instance. */
  private node: ClassSanitizer<IAstNode>;
  /** The filter preferences specifying which fields to include. */
  private filters: AstNodeFiltersRecord;
  /** Cached record of method calls for each filterable field. */
  private calls: AstNodeSanitizedFilterCallRecord = {
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
   * Creates a new AstSanitizedFiltered instance.
   *
   * @param sanitized - The sanitized AST node to work with.
   * @param preferences - The filter preferences for field selection.
   *
   * @aidoc
   */
  constructor(astNode: IAstNode, preferences: AstNodeFiltersRecord) {
    this.node = createSanitizedView<IAstNode>(astNode);
    this.filters = preferences;
  }

  /**
   * Builds the final sanitized AST node object based on the filter preferences.
   * @returns A partial sanitized AST node with only the requested fields.
   *
   * @aidoc
   */
  build(): AstNodeSanitizedFilteredSanitizedKey {
    const fields = Object.fromEntries(
      Object.entries(this.filters).map(([field, prefs]) => [
        field,
        this.getCalls(prefs),
      ]),
    ) as AstNodeSanitizedFilteredFields;
    return {
      key: Date.now().toString(),
      fields,
    };
  }

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

  /**
   * Gets the try-catch results for the specified filter keys.
   * @param props - Array of filter keys to retrieve.
   * @returns An object mapping each key to its try-catch result.
   * @private
   */
  private getCalls(props: AstNodeFilterKeys[]) {
    return Object.fromEntries(props.map((p) => [p, this.calls[p]!()]));
  }

  /**
   * Recursively processes a list of AST nodes, creating sanitized views for each.
   * @param list - The try-catch wrapped list of AST nodes.
   * @returns A try-catch wrapped array of sanitized AST node partials.
   * @private
   *
   * @aidoc
   */
  private recurse(list: TryCatch<IAstNode[]>) {
    if (list.state === "fail") {
      return list;
    }

    const narrowed = list.value.map((n) => {
      return new AstSanitizedFiltered(n, this.filters).build();
    });

    return tryCatch("narrowed", () => narrowed);
  }
}
