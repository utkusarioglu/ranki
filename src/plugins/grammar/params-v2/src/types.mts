import { AstNode, AstNodeLeafSource } from "@ranki/package-api-v2";
import type { NodeArgsBaseV2 } from "@ranki/plugin-parser-base-v2";

type NodeArgsParamsV2 = AstNode["args"] & Partial<NodeArgsBaseV2>;

export type ParamV2 = ParamV2Setting | ParamV2Directive;

export interface ParamV2Common {
  key: "positional" | ParamV2Key;
  args: NodeArgsParamsV2;
  operator: ParamV2Operator;
  values: ParamV2Value[];
  source: AstNodeLeafSource;
}

export type ParamV2Setting = ParamV2Common & {
  type: "setting";
  namespace: number;
};

export type ParamV2Directive = ParamV2Common & {
  type: "directive";
  // key: ParamV2Key; // @overload
};

export type ParamV2SettingNamespace = number;

export type ParamV2Key = ParamV2KeyWord[]; // @overload

export type ParamV2KeyWord = string & { type?: "ParamV2Key" };

export type ParamV2Operator = "assign" | "append" | "remove";

export type ParamV2Value =
  | ParamV2ValueNumber
  | ParamV2ValueString
  | ParamV2ValueBoolean
  | ParamV2ValueQuoted;

interface ParamV2ValueNumber {
  type: "number";
  raw: string;
  value: number;
}

interface ParamV2ValueString {
  type: "lowercase" | "uppercase" | "mixedcase";
  raw: string;
}

interface ParamV2ValueQuoted {
  type: "quoted";
  raw: string;
  value: string;
}

interface ParamV2ValueBoolean {
  type: "boolean";
  raw: string;
  value: boolean;
}

export type ParamsV2Spec = ParamsV2SpecPopulated | ParamsV2SpecNone;
// {
//   variant: "block" | "inline" | "none";
//   items: ParamV2[];
// }

export interface ParamsV2SpecPopulated {
  variant: "block" | "inline";
  items: ParamV2[];
}

/**
 * @dev
 * this is never returned by ArgsAndParamsV2 but it's still a useful
 * to have the type.
 */
export interface ParamsV2SpecNone {
  variant: "none";
  items: [];
}

export interface ArgsAndParamsV2 {
  args: NodeArgsParamsV2;
  params: ParamsV2SpecPopulated;
}
export interface RankiParamsV2ParserPluginConfig {
  tokens: {
    separator: {
      param: Single;
    };
    key: {
      directive: Single;
      negation: Single;
    };
    operators: {
      assign: Single;
      append: Single;
      remove: Single;
    };
  };
}

export type WithRankiParamsV2ParserPluginConfig = {
  RankiParamsV2: RankiParamsV2ParserPluginConfig;
};
export type Single = string;

// export interface ArgsAndParamsV2WithNone {
//   args: NodeArgsParamsV2;
//   params: ParamsV2SpecNone;
// }
