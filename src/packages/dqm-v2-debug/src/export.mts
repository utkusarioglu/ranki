/**
 * Main export module for the dqm-v2-debug package.
 *
 * This module re-exports key functions and types from various submodules
 * to provide a convenient entry point for consumers of the debug utilities.
 */

/**
 * Re-exports the createSanitizedAst function from the AST sanitizer module.
 * This function creates a sanitized view of AST nodes for debugging purposes.
 */
export { createSanitizedAst } from "./sanitize/node-types/ast/ast.mjs";

/**
 * Re-exports all types from the AST types module.
 * These types define the structure of sanitized AST nodes and related data.
 */
export type * from "./sanitize/node-types/ast/ast.types.mjs";

/**
 * Re-exports all exports from the try-catch utility module.
 * This includes utility functions and types for handling operations that may fail.
 */
export * from "./utils/try-catch.mjs";

/**
 * Re-exports all exports from the class sanitizer module.
 * This provides utilities for creating sanitized views of class instances.
 */
export * from "./sanitize/common/class-sanitizer/sanitizer.mjs";
