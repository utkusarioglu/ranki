import type { IAstNode, ICpx } from "@dqm/package-dqm-api-v2";
import type { Filters } from "../../common/node-filter/filter.types.mjs";

export interface CpxNodeSanitizedTypesRecord {
  unique: ReturnType<ICpx["getUnique"]>;
  chainListString: ReturnType<ICpx["getChainListString"]>;
  cpxEdges: ReturnType<ICpx["getCpxEdges"]>;

  cpsCount: number;
  rootAstSourceString: ReturnType<IAstNode["getSourceString"]>;
}

/**
 * Filter preferences record that maps field names to arrays of filter keys.
 * This allows users to specify which fields they want to include for each category.
 *
 * @aidoc
 */
export type CpxNodeFiltersRecord = Filters<CpxNodeSanitizedTypesRecord>;
