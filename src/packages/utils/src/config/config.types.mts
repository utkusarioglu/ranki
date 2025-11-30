export type ConfigTypes =
  | "string"
  | "number"
  | "boolean"
  | "array-empty"
  | "array-populated"
  | "kv-empty"
  | "kv-populated"
  | "null"
  | "undefined";

export type LocalConfig = any;

export type ObjectPath = string & { type?: "ObjectPath" };
