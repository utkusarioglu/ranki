import type { DqmAstOutput, IAstNode } from "@dqm/package-dqm-api-v2";
import { createSanitizedView } from "../../../export.mjs";
import type { SanitizedParseResult } from "../../general.types.mjs";
import { AstSanitizedNarrowed } from "./ast.filter.mjs";
import type {
  AstNodeSanitizedFiltersRecord,
  AstNodeSanitizedFiltered,
} from "./ast.filter.types.mjs";
import type { AstNodeSanitizedTry } from "./ast.sanitize.types.mjs";

/**
 * Sanitizes an array of AST outputs based on the provided filter preferences.
 * @param parsed - The raw AST output from parsing.
 * @param features - The filter preferences for each field.
 * @returns An array of sanitized AST nodes.
 *
 * @aidoc
 */
function sanitizeAst(
  parsed: DqmAstOutput,
  features: AstNodeSanitizedFiltersRecord,
): AstNodeSanitizedFiltered[] {
  return parsed.map((p) => {
    const sanitized = createSanitizedView<IAstNode>(p.ast);
    return {
      theater: p.theater,
      sanitized: new AstSanitizedNarrowed(sanitized, features).build(),
    };
  });
}

/**
 * Creates a sanitized AST from a parse result.
 *
 * This is the main entry point for AST sanitization. It takes a parse result
 * and filter preferences, and returns a sanitized view suitable for debugging.
 *
 * @param parsed - The result of parsing, which may have succeeded or failed.
 * @param preferences - Filter preferences specifying which AST node fields to include.
 * @returns A sanitized AST result, either successful with data or failed with an error.
 *
 * @aidoc
 */
export function createSanitizedAst(
  parsed: SanitizedParseResult,
  preferences: AstNodeSanitizedFiltersRecord,
): AstNodeSanitizedTry {
  try {
    if (parsed.state !== "success") {
      return {
        state: "fail",
        error: parsed.error,
      };
    }
    const sanitized = sanitizeAst(parsed.data.ast, preferences);
    return {
      state: "success",
      data: sanitized,
    };
  } catch (e) {
    console.log(e);
    return {
      state: "fail",
      error: e as any,
    };
  }
}
