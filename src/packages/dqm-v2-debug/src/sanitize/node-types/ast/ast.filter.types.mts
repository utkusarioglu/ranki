/**
 * Type definitions for AST sanitization.
 *
 * This module defines all the types used in the AST sanitization process,
 * including the structure of sanitized AST nodes and filter preferences.
 *
 * @aidoc
 */

import type { DqmParseTheater, IAstNode, ICpx } from "@dqm/package-dqm-api-v2";
import type {
  TryCatchCall,
  TryCatchRecord,
} from "../../../utils/try-catch.mjs";

/**
 * A sanitized AST node with theater information.
 *
 * @dev
 * #1 The parse theater this AST node belongs to.
 * #2 The partially sanitized AST node data.
 *
 * @aidoc
 */
export type AstNodeFiltered = {
  theater: DqmParseTheater; // #1
  sanitized: AstNodeFilteredSanitizedKey; // #2
};

/**
 * A partially sanitized AST node with a key and filtered fields.
 *
 * @dev
 * #1 A unique key for this sanitized node (currently uses timestamp).
 * #2 The filtered fields based on user preferences.
 *
 * @aidoc
 */
export type AstNodeFilteredSanitizedKey = {
  key: string; // #1
  fields: AstNodeFilteredFields; // #2
};

/**
 * The structure of partially sanitized fields, mapping field names to try-catch wrapped records.
 */
export type AstNodeFilteredFields = Record<
  string,
  Partial<TryCatchRecord<AstNodeSanitizedTypesRecord>>
>;

/**
 * A record of function calls that return try-catch wrapped values for each AST node field.
 */
export type AstNodeSanitizedFilterCallRecord =
  TryCatchCall<AstNodeSanitizedTypesRecord>;

/**
 * Union type of all possible filter keys that can be used to select AST node fields.
 */
export type AstNodeFilterKeys = keyof AstNodeSanitizedTypesRecord;

/**
 * Record defining all the possible fields that can be extracted from an AST node.
 * Combines primitive properties with ICpx and IAstNode interface properties.
 *
 * @aidoc
 */
export type AstNodeSanitizedTypesRecord = AstNodePrimitiveView &
  AstNodeICpxView &
  AstNodeIAstNodeView;

/**
 * Primitive view of an AST node, containing basic properties and child node arrays.
 *
 * @dev
 * #1 The constructor name of the AST node class.
 * #2 Number of child nodes.
 * #3 Number of ignored nodes.
 * #4 Number of nodes in the subtree.
 * #5 Array of sanitized child nodes.
 * #6 Array of sanitized direct children.
 * #7 Array of sanitized token nodes.
 * #8 Array of sanitized space nodes.
 *
 * @aidoc
 */
interface AstNodePrimitiveView {
  constructorName: string; // #1
  childCount: number; // #2
  ignoredCount: number; // #3
  subtreeCount: number; // #4

  subtreeNodes: AstNodeFilteredSanitizedKey[]; // #5
  childrenNodes: AstNodeFilteredSanitizedKey[]; // #6
  tokenNodes: AstNodeFilteredSanitizedKey[]; // #7
  spaceNodes: AstNodeFilteredSanitizedKey[]; // #8
}

/**
 * View of an AST node's CPX (Complex) component properties.
 *
 * @dev
 * #1 String representation of the node's ID list.
 * #2 Unique identifier from the CPX (Complex) component.
 * #3 String representation of the node's chain list.
 *
 * @aidoc
 */
interface AstNodeICpxView {
  idListString: ReturnType<ICpx["getIdListString"]>; // #1
  cpxUnique: ReturnType<ICpx["getUnique"]>; // #2
  chainListString: ReturnType<ICpx["getChainListString"]>; // #3
}

/**
 * View of an AST node's IAstNode interface properties.
 *
 * @dev
 * #1 Unique identifier for the AST node.
 * #2 Name of the creator that generated this AST node.
 * #3 The index of this node among its siblings.
 * #4 Depth in the inline hierarchy.
 * #5 Depth in the block hierarchy.
 * #6 The kind/type of the AST node.
 * #7 The method used to create this AST node.
 * #8 Optional meaning or semantic information about the node.
 * #9 The source string representation of the AST node.
 *
 * @aidoc
 */
interface AstNodeIAstNodeView {
  astUnique: ReturnType<IAstNode["getUnique"]>; // #1
  creator: ReturnType<IAstNode["getCreator"]>; // #2
  childIndex: ReturnType<IAstNode["getChildIndex"]>; // #3
  inlineDepth: ReturnType<IAstNode["getInlineDepth"]>; // #4
  blockDepth: ReturnType<IAstNode["getBlockDepth"]>; // #5
  kind: ReturnType<IAstNode["getKind"]>; // #6
  creationMethod: ReturnType<IAstNode["getCreationMethod"]>; // #7
  meaning: ReturnType<IAstNode["getMeaning"]>; // #8
  sourceString: ReturnType<IAstNode["getSourceString"]>; // #9
}

/**
 * Filter preferences record that maps field names to arrays of filter keys.
 * This allows users to specify which fields they want to include for each category.
 *
 * @aidoc
 */
export type AstNodeFiltersRecord = Record<string, AstNodeFilterKeys[]>;
