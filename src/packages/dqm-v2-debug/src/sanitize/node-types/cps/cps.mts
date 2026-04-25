import type { DqmAstOutputTheater, ICps } from "@dqm/package-dqm-api-v2";
import type { SanitizeModes } from "../../../export.mjs";
import { filterCommon } from "../../common/node-filter/filter.mjs";
import type { Theatered } from "../../common/node-filter/filter.types.mjs";
import type { SanitizedParseResult } from "../../general.types.mjs";
import { getCpxRoot } from "../cpx/cpx.mjs";
import { CpsSanitizedFiltered } from "./cps.filter.mjs";
import type {
  CpsNodeFiltersRecord,
  CpsNodeSanitizedTypesRecord,
} from "./cps.filter.types.mjs";

function getCpsRoot(p: DqmAstOutputTheater): ICps {
  const cpx = getCpxRoot(p);
  const cps = cpx.getRootCps();
  return cps;
}

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
export function createFilteredCps(
  parsed: SanitizedParseResult,
  filters: CpsNodeFiltersRecord,
): SanitizeModes<Theatered<CpsNodeSanitizedTypesRecord>[]> {
  return filterCommon<CpsNodeSanitizedTypesRecord>(parsed, (success) => {
    return success.ast.map((p) => {
      const cps = getCpsRoot(p);
      return {
        theater: p.theater,
        sanitized: new CpsSanitizedFiltered(cps, filters).build(),
      };
    });
  });
}
