// import type { NodeArgs as NodeArgsBaseV2 } from "@ranki/package-api";
import { ParseNode } from "@ranki/package-api";
import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";

type NodeArgsParamsV2 = ParseNode["args"] & Partial<NodeArgsBaseV2>;

export interface ParamV2 {
  key: string;
  args: NodeArgsParamsV2;
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

export interface ParamsV2Spec {
  variant: "block" | "inline" | "none";
  items: ParamV2[];
}

export interface ArgsAndParamsV2 {
  args: NodeArgsParamsV2;
  params: ParamsV2Spec;
}
