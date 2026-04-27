import type { ITrnNode } from "@dqm/package-dqm-api-v2";
import type { Filters } from "../../common/node-filter/filter.types.mjs";

export interface ITrnNodeSanitizedTypesRecord {
  kind: ReturnType<ITrnNode["getKind"]>;
  transformClass: ReturnType<ITrnNode["getTransformClass"]>;
  isMount: ReturnType<ITrnNode["getIsMount"]>;
  localTrnEdges: ReturnType<ITrnNode["getLocalTrnEdges"]>;
  foreignTrnEdges: ReturnType<ITrnNode["getForeignTrnEdges"]>;
  source: ReturnType<ITrnNode["getSource"]>;
  chainString: ReturnType<ITrnNode["getChainString"]>;
}

/**
 * Filter preferences record that maps field names to arrays of filter keys.
 * This allows users to specify which fields they want to include for each category.
 *
 * @aidoc
 */
export type ITrnNodeFiltersRecord = Filters<ITrnNodeSanitizedTypesRecord>;
