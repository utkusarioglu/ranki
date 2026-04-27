import type { ITCpxNode } from "@dqm/package-dqm-api-v2";
import type { Filters } from "../../common/node-filter/filter.types.mjs";

export interface TCpxNodeSanitizedTypesRecord {
  tCpxEdges: ReturnType<ITCpxNode["getTCpxEdges"]>;
  tCpsCount: number;
}

/**
 * Filter preferences record that maps field names to arrays of filter keys.
 * This allows users to specify which fields they want to include for each category.
 *
 * @aidoc
 */
export type TCpxNodeFiltersRecord = Filters<TCpxNodeSanitizedTypesRecord>;
