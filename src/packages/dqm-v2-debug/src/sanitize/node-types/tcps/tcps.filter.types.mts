import type { ITCpsNode } from "@dqm/package-dqm-api-v2";
import type { Filters } from "../../common/node-filter/filter.types.mjs";

export interface TCpsNodeSanitizedTypesRecord {
  tCpsEdges: ReturnType<ITCpsNode["getTCpsEdges"]>;
}

/**
 * Filter preferences record that maps field names to arrays of filter keys.
 * This allows users to specify which fields they want to include for each category.
 *
 * @aidoc
 */
export type TCpsNodeFiltersRecord = Filters<TCpsNodeSanitizedTypesRecord>;
