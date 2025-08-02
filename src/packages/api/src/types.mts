import type { WARNINGS } from "./constants.mjs";

interface AstNodeConfiguration {
  keyword: string;
  values: AstNodeConfigurationValue[];
}

interface AstNodeParameterValueWord {
  type: "word";
  value: string;
}

interface AstNodeParameterValueBoolean {
  type: "boolean";
  value: boolean;
}

interface AstNodeParameterValueNumber {
  type: "number";
  value: number;
}

interface AstNodeParameterValueAstNode {
  type: "frame";
  value: AstNode;
}

interface AstNodeParameterValueDoubleQuote {
  type: "literalDoubleQuote";
  value: string;
}

interface AstNodeParameterValueSingleQuote {
  type: "literalSingleQuote";
  value: string;
}

type AstNodeParameterValue =
  | AstNodeParameterValueWord
  | AstNodeParameterValueBoolean
  | AstNodeParameterValueNumber
  | AstNodeParameterValueAstNode
  | AstNodeParameterValueDoubleQuote
  | AstNodeParameterValueSingleQuote;

export interface AstNodeParameter {
  keyword: string;
  values: AstNodeParameterValue[];
}

type AstNodeConfigurationValue = AstPrimitive;

type AstNodeWarning = (typeof WARNINGS)[keyof typeof WARNINGS];

type AstPrimitive = string | number | boolean;

export interface AstNode {
  type: string;
  warnings?: AstNodeWarning[];
  configuration?: AstNodeConfiguration[];
  parameters?: AstNodeParameter[];
  attributes?: AstNodeParameter[];
  children?: AstNode[];
  source?: AstPrimitive;
}
