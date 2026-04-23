import type { SanitizeSuccess, SanitizeFail } from "../../../export.mjs";
import type { AstNodeFiltered } from "./ast.filter.types.mjs";

/**
 * Union type representing either a successful or failed AST sanitization result.
 */

export type AstNodeSanitizedTry =
  | SanitizeSuccess<AstNodeFiltered[]>
  | SanitizeFail;
