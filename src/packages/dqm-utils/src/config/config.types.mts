export type ConfigTypes =
  | "string"
  | "bigint"
  | "number"
  | "boolean"
  | "kv-empty"
  | "kv-populated"
  | "null"
  | "undefined"
  | "illegal"
  | "array-empty"
  // The rest are the only types params can assign
  | "array-scalar"
  | "array-populated"
  | "tuple";

export type LocalConfig = any;

export type ObjectPath = string & { type?: "ObjectPath" };

export type TypeOfResult =
  | "string"
  | "number"
  | "boolean"
  | "bigint"
  | "symbol"
  | "undefined"
  | "object"
  | "function";

export type LogMode = "normal" | "verbose";
