import type {
  Filters,
  Theatered,
} from "../../common/node-filter/filter.types.mjs";
import type { SanitizedParseResult } from "../../general.types.mjs";
import { AstSanitizedFiltered } from "./ast.filter.mjs";
import type { AstNodeSanitizedTypesRecord } from "./ast.filter.types.mjs";
import type { SanitizeModes } from "./ast.sanitize.types.mjs";

/**
 * Creates a sanitized AST from a parse result.
 *
 * This is the main entry point for AST sanitization. It takes a parse result
 * and filter preferences, and returns a sanitized view suitable for debugging.
 *
 * @param parsed - The result of parsing, which may have succeeded or failed.
 * @param filters - Filter preferences specifying which AST node fields to include.
 * @returns A sanitized AST result, either successful with data or failed with an error.
 *
 * @aidoc
 */
export function createFilteredAst(
  parsed: SanitizedParseResult,
  filters: Filters<AstNodeSanitizedTypesRecord>,
): SanitizeModes<Theatered<AstNodeSanitizedTypesRecord>[]> {
  try {
    if (parsed.state !== "success") {
      return {
        state: "fail",
        error: parsed.error,
      };
    }
    const sanitized = parsed.data.ast.map((p) => {
      return {
        theater: p.theater,
        sanitized: new AstSanitizedFiltered(p.ast, filters).build(),
      };
    });
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
