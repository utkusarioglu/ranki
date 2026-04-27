import type { SanitizeModes } from "../../../export.mjs";
import { filterCommon } from "../../common/node-filter/filter.mjs";
import type { Theatered } from "../../common/node-filter/filter.types.mjs";
import type { SanitizedParseResult } from "../../general.types.mjs";
import { TCpxSanitizedFiltered } from "./tcpx.filter.mjs";
import type {
  TCpxNodeFiltersRecord,
  TCpxNodeSanitizedTypesRecord,
} from "./tcpx.filter.types.mjs";

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
export function createFilteredTcpx(
  parsed: SanitizedParseResult,
  filters: TCpxNodeFiltersRecord,
): SanitizeModes<Theatered<TCpxNodeSanitizedTypesRecord>[]> {
  return filterCommon<TCpxNodeSanitizedTypesRecord>(parsed, (success) => {
    return success.trn.map((p) => {
      return {
        theater: p.theater,
        sanitized: new TCpxSanitizedFiltered(p.tCpx, filters).build(),
      };
    });
  });
}
