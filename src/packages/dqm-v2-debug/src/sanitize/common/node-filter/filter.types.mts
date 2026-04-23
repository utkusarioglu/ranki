import type { DqmParseTheater } from "@dqm/package-dqm-api-v2";
import type { TryCatchRecord, TryCatchCall } from "../../../export.mjs";

/**
 * A sanitized node with theater information.
 *
 * @dev
 * #1 The parse theater this AST node belongs to.
 * #2 The partially sanitized AST node data.
 *
 * @aidoc
 */

export type Theatered<TypeRecord extends object> = {
  theater: DqmParseTheater; // #1
  sanitized: Keyed<TypeRecord>; // #2
};

export type Filters<TypesRecord extends object> = Record<
  string,
  (keyof TypesRecord)[]
>;

export type FilterKeys<TypesRecord> = keyof TypesRecord;
/**
 * @dev
 * #1 A unique key for this sanitized node (currently uses timestamp).
 * #2 The filtered fields based on user preferences.
 *
 * @aidoc
 */
export type Keyed<TypesRecord extends object> = {
  key: string;
  fields: Fields<TypesRecord>;
};

export type Fields<TypesRecord extends object> = Record<
  string,
  Partial<TryCatchRecord<TypesRecord>>
>;

export type Calls<TypesRecord extends object> = TryCatchCall<TypesRecord>;
