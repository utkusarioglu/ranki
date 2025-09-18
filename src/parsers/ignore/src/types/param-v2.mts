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
  | ParamV2ValueLowercase
  | ParamV2ValueBoolean;

interface ParamV2ValueNumber {
  type: "number";
  value: number;
}

interface ParamV2ValueLowercase {
  type: "lowercase";
  value: string;
}

interface ParamV2ValueBoolean {
  type: "boolean";
  value: boolean;
}
