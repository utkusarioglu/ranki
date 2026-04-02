import type { IAstNode } from "@dqm/package-dqm-api-v2";
import type {
  SanitizeSuccess,
  SanitizeFail,
  ClassSanitizer,
} from "../../../export.mjs";
import type { AstNodeSanitizedFiltered } from "./ast.filter.types.mjs";

/**
 * Union type representing either a successful or failed AST sanitization result.
 */

export type AstNodeSanitizedTry =
  | SanitizeSuccess<AstNodeSanitizedFiltered[]>
  | SanitizeFail;

export type AstNodeSanitized = ClassSanitizer<IAstNode>;
