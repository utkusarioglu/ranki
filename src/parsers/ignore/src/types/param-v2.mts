import type { NodeArgs } from "./node-arg.mjs";

export interface ParamV2 {
  key: string;
  args: NodeArgs;
  operator: ParamV2Operator;
  values: ParamV2Value[];
}

export type ParamV2Operator = "assign" | "append" | "remove";

export type ParamV2Value =
  | ParamV2ValueNumber
  | ParamV2ValueString
  | ParamV2ValueBoolean
  | ParamV2ValueQuoted;

interface ParamV2ValueNumber {
  type: "number";
  value: number;
}

interface ParamV2ValueString {
  type: "lowercase" | "uppercase" | "mixed";
  value: string;
}

interface ParamV2ValueQuoted {
  type: "quoted";
  value: string;
}

interface ParamV2ValueBoolean {
  type: "boolean";
  value: boolean;
}
