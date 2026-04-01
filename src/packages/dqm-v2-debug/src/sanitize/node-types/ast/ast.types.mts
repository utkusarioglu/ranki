/**
 * Type definitions for AST sanitization.
 *
 * This module defines all the types used in the AST sanitization process,
 * including the structure of sanitized AST nodes and filter preferences.
 *
 * @aidoc
 */

import type {
  DqmParseTheater,
  CreatorName,
  IAstNodeKind,
  CounterStat,
  CreationMethod,
  AstSourceString,
  UniqueValue,
  IdListString,
} from "@dqm/package-dqm-api-v2";
import type {
  TryCatchCall,
  TryCatchRecord,
} from "../../../utils/try-catch.mjs";

/**
 * Interface for the sanitized data structure containing an array of sanitized AST nodes.
 * Note: This interface may be redundant and the `sanitized` property could become the object itself.
 *
 * @dev
 * #1 Array of sanitized AST nodes.
 *
 * @aidoc
 */
export interface AstNodeSanitizeSanitized {
  sanitized: AstNodeSanitized[]; // #1
}

/**
 * Represents a successful AST sanitization result.
 *
 * @dev
 * #1 Indicates the sanitization was successful.
 * #2 The sanitized AST data.
 *
 * @aidoc
 */
interface AstNodeSanitizeSuccess {
  state: "success"; // #1
  data: AstNodeSanitizeSanitized; // #2
}

/**
 * Represents a failed AST sanitization result.
 *
 * @dev
 * #1 Indicates the sanitization failed.
 * #2 The error message describing the failure.
 *
 * @aidoc
 */
interface AstNodeSanitizeFail {
  state: "fail"; // #1
  error: string; // #2
}

/**
 * Union type representing either a successful or failed AST sanitization result.
 */
export type AstNodeSanitize = AstNodeSanitizeSuccess | AstNodeSanitizeFail;

/**
 * A sanitized AST node with theater information.
 *
 * @dev
 * #1 The parse theater this AST node belongs to.
 * #2 The partially sanitized AST node data.
 *
 * @aidoc
 */
export type AstNodeSanitized = {
  theater: DqmParseTheater; // #1
  sanitized: AstNodePartialSanitized; // #2
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
export type AstNodePartialSanitized = {
  key: string; // #1
  fields: AstNodeSanitizedPartialFields; // #2
};

/**
 * The structure of partially sanitized fields, mapping field names to try-catch wrapped records.
 */
export type AstNodeSanitizedPartialFields = Record<
  string,
  Partial<TryCatchRecord<AstNodeSanitizedTypesRecord>>
>;

/**
 * A record of function calls that return try-catch wrapped values for each AST node field.
 */
export type AstNodeSanitizedCallRecord =
  TryCatchCall<AstNodeSanitizedTypesRecord>;

/**
 * Union type of all possible filter keys that can be used to select AST node fields.
 */
export type AstNodeFilterKeys = keyof AstNodeSanitizedTypesRecord;

/**
 * Record defining all the possible fields that can be extracted from an AST node.
 * Each field corresponds to a property or computed value from the AST node.
 *
 * @dev
 * #1 Unique identifier for the AST node.
 * #2 Name of the creator that generated this AST node.
 * #3 String representation of the node's ID list.
 * #4 The kind/type of the AST node.
 * #5 The constructor name of the AST node class.
 * #6 Unique identifier from the CPX (Complex) component.
 * #7 The index of this node among its siblings.
 * #8 Depth in the inline hierarchy.
 * #9 Depth in the block hierarchy.
 * #10 String representation of the node's chain list.
 * #11 Number of child nodes.
 * #12 Number of ignored nodes.
 * #13 Number of nodes in the subtree.
 * #14 Optional meaning or semantic information about the node.
 * #15 The method used to create this AST node.
 * #16 Array of sanitized child nodes.
 * #17 Array of sanitized direct children.
 * #18 Array of sanitized token nodes.
 * #19 Array of sanitized space nodes.
 * #20 The source string representation of the AST node.
 *
 * @aidoc
 */
export interface AstNodeSanitizedTypesRecord {
  astUnique: UniqueValue; // #1
  creator: CreatorName; // #2
  idListString: IdListString; // #3
  kind: IAstNodeKind; // #4
  constructorName: string; // #5
  cpxUnique: UniqueValue; // #6
  childIndex: CounterStat; // #7
  blockDepth: CounterStat; // #8
  inlineDepth: CounterStat; // #9
  chainListString: string; // #10
  childCount: number; // #11
  ignoredCount: number; // #12
  subtreeCount: number; // #13
  meaning: string | undefined; // #14
  creationMethod: CreationMethod; // #15
  subtreeNodes: AstNodePartialSanitized[]; // #16
  childrenNodes: AstNodePartialSanitized[]; // #17
  tokenNodes: AstNodePartialSanitized[]; // #18
  spaceNodes: AstNodePartialSanitized[]; // #19
  sourceString: AstSourceString; // #20
}

/**
 * Filter preferences record that maps field names to arrays of filter keys.
 * This allows users to specify which fields they want to include for each category.
 *
 * @aidoc
 */
export type AstNodeSanitizedFiltersRecord = Record<string, AstNodeFilterKeys[]>;
