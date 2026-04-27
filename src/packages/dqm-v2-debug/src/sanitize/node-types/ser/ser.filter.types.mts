import type {
  ISerializedLeaf,
  ISerializedNode,
  ISerializedParent,
} from "@dqm/package-dqm-api-v2";
import type { Filters } from "../../common/node-filter/filter.types.mjs";

export interface SerNodeSanitizedTypesRecord {
  key: ISerializedNode["key"];
  chain: ISerializedNode["chain"];
  props: ISerializedNode["props"];
  kind: ISerializedNode["kind"];
  source: ISerializedLeaf["source"];
  children: ISerializedParent["children"];
}

/**
 * Filter preferences record that maps field names to arrays of filter keys.
 * This allows users to specify which fields they want to include for each category.
 *
 * @aidoc
 */
export type SerNodeFiltersRecord = Filters<SerNodeSanitizedTypesRecord>;
