import type { DqmAstOutputTheater, ICpx } from "@dqm/package-dqm-api-v2";
import type { SanitizeModes } from "../../common/class-sanitizer/sanitizer.types.mjs";
import type { Theatered } from "../../common/node-filter/filter.types.mjs";
import type { SanitizedParseResult } from "../../general.types.mjs";
import { CpxSanitizedFiltered } from "./cpx.filter.mjs";
import type {
  CpxNodeFiltersRecord,
  CpxNodeSanitizedTypesRecord,
} from "./cpx.filter.types.mjs";
import { filterCommon } from "../../common/node-filter/filter.mjs";

export function getCpxRoot(p: DqmAstOutputTheater): ICpx {
  let cpx = p.ast.getCpx()!;
  let parent = cpx.getCpxParent();
  while (parent !== null) {
    cpx = parent;
    parent = parent.getCpxParent();
  }
  return cpx;
}

export function createFilteredCpx(
  parsed: SanitizedParseResult,
  filters: CpxNodeFiltersRecord,
): SanitizeModes<Theatered<CpxNodeSanitizedTypesRecord>[]> {
  return filterCommon<CpxNodeSanitizedTypesRecord>(parsed, (success) => {
    return success.ast.map((p) => {
      const cpx = getCpxRoot(p);
      return {
        theater: p.theater,
        sanitized: new CpxSanitizedFiltered(cpx, filters).build(),
      };
    });
  });
}
