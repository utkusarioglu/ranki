import type * as ohm from "ohm-js";

export interface AstNodeConfiguration {
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
  value: AstNodeIndefinite;
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

type AstNodeConfigurationValue = AstNodePrimitive;

export type AstNodePrimitive = string | number | boolean;

/**
 * Properties common for all nodes
 */
interface AstNodeCommon {
  type: string;
  configuration: AstNodeConfiguration[];
  parameters: AstNodeParameter[];
  attributes: AstNodeParameter[];
}

/**
 * ast node with no children but only unqualified content such as simple text
 */
export type AstNodeLeaf = AstNodeCommon & {
  kind: "leaf";
  source: AstNodePrimitive;
  ohm?: null;
};

/**
 * parsed parent with unparsed children
 */
export type AstNodeParentIndefinite = AstNodeCommon & {
  kind: "parent";
  completion: "indefinite";
  children: AstNodeIndefinite[];
  ohm?: null;
};

/**
 * parsed parent with parsed children
 */
export type AstNodeParentDefinite = AstNodeCommon & {
  kind: "parent";
  completion: "definite";
  children: AstNodeDefinite[];
  ohm?: null;
};

/**
 * Unparsed node, it will need a plugin to work on it
 */
export type AstNodeUnparsed = AstNodeCommon & {
  kind: "unparsed";
  ohm: ohm.Node;
};

/**
 * All kinds of ast nodes, you don't know whether the root is parsed, nor the children
 */
export type AstNodeIndefinite =
  | AstNodeLeaf
  | AstNodeUnparsed
  | AstNodeParentDefinite
  | AstNodeParentIndefinite;

/**
 * both the root and the children are parsed
 */
export type AstNodeDefinite = AstNodeLeaf | AstNodeParentDefinite;

export type AstNodeParameters = AstNodeCommon;
