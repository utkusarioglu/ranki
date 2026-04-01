/**
 * Type definitions for AST sanitization.
 *
 * This module defines all the types used in the AST sanitization process,
 * including the structure of sanitized AST nodes and filter preferences.
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
 */
export interface AstNodeSanitizeSanitized {
  /** Array of sanitized AST nodes. */
  sanitized: AstNodeSanitized[];
}

/**
 * Represents a successful AST sanitization result.
 */
interface AstNodeSanitizeSuccess {
  /** Indicates the sanitization was successful. */
  state: "success";
  /** The sanitized AST data. */
  data: AstNodeSanitizeSanitized;
}

/**
 * Represents a failed AST sanitization result.
 */
interface AstNodeSanitizeFail {
  /** Indicates the sanitization failed. */
  state: "fail";
  /** The error message describing the failure. */
  error: string;
}

/**
 * Union type representing either a successful or failed AST sanitization result.
 */
export type AstNodeSanitize = AstNodeSanitizeSuccess | AstNodeSanitizeFail;

/**
 * A sanitized AST node with theater information.
 */
export type AstNodeSanitized = {
  /** The parse theater this AST node belongs to. */
  theater: DqmParseTheater;
  /** The partially sanitized AST node data. */
  sanitized: AstNodePartialSanitized;
};

/**
 * A partially sanitized AST node with a key and filtered fields.
 */
export type AstNodePartialSanitized = {
  /** A unique key for this sanitized node (currently uses timestamp). */
  key: string;
  /** The filtered fields based on user preferences. */
  fields: AstNodeSanitizedPartialFields;
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
 */
export interface AstNodeSanitizedTypesRecord {
  /** Unique identifier for the AST node. */
  astUnique: UniqueValue;
  /** Name of the creator that generated this AST node. */
  creator: CreatorName;
  /** String representation of the node's ID list. */
  idListString: IdListString;
  /** The kind/type of the AST node. */
  kind: IAstNodeKind;
  /** The constructor name of the AST node class. */
  constructorName: string;
  /** Unique identifier from the CPX (Complex) component. */
  cpxUnique: UniqueValue;
  /** The index of this node among its siblings. */
  childIndex: CounterStat;
  /** Depth in the inline hierarchy. */
  blockDepth: CounterStat;
  /** Depth in the block hierarchy. */
  inlineDepth: CounterStat;
  /** String representation of the node's chain list. */
  chainListString: string;
  /** Number of child nodes. */
  childCount: number;
  /** Number of ignored nodes. */
  ignoredCount: number;
  /** Number of nodes in the subtree. */
  subtreeCount: number;
  /** Optional meaning or semantic information about the node. */
  meaning: string | undefined;
  /** The method used to create this AST node. */
  creationMethod: CreationMethod;
  /** Array of sanitized child nodes. */
  subtreeNodes: AstNodePartialSanitized[];
  /** Array of sanitized direct children. */
  childrenNodes: AstNodePartialSanitized[];
  /** Array of sanitized token nodes. */
  tokenNodes: AstNodePartialSanitized[];
  /** Array of sanitized space nodes. */
  spaceNodes: AstNodePartialSanitized[];
  /** The source string representation of the AST node. */
  sourceString: AstSourceString;
}

/**
 * Filter preferences record that maps field names to arrays of filter keys.
 * This allows users to specify which fields they want to include for each category.
 */
export type AstNodeSanitizedFiltersRecord = Record<string, AstNodeFilterKeys[]>;
