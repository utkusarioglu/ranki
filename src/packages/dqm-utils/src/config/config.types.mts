export type ConfigTypes =
  | "string"
  | "bigint"
  | "number"
  | "boolean"
  | "array-empty"
  | "array-scalar"
  | "array-populated"
  | "tuple"
  | "kv-empty"
  | "kv-populated"
  | "null"
  | "undefined"
  | "illegal";

export type LocalConfig = any;

export type ObjectPath = string & { type?: "ObjectPath" };
