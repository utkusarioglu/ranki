import type { AstNode, AstNodeLeaf, AstNodeParent } from "./ast.mjs";

export interface ValidatorFunctionEntry {
  source: string; // name of the plugin
  callback: RankiPluginParserValidationFunc;
}

export type ValidationNodeWarningEntry = string;

export type ValidationNodeErrorEntry = string;

export interface ValidationNodeValidationEntry {
  warnings: ValidationNodeWarningEntry[];
  errors: ValidationNodeErrorEntry[];
}

export type ValidationNode = ValidationNodeParent | ValidationNodeLeaf;

export type ValidationNodeLeaf = AstNodeLeaf & {
  validation: ValidationNodeValidationEntry;
};

export type ValidationNodeParent = Omit<AstNodeParent, "children"> & {
  validation: ValidationNodeValidationEntry;
  children: ValidationNode[];
};

export type RankiPluginParserValidationFunc = (
  a: AstNode,
) => ValidationNodeValidationEntry;

export type RankiPluginParserValidationDictionary = Record<
  string,
  RankiPluginParserValidationFunc
>;

export type RankiPluginParserValidationCallback =
  () => RankiPluginParserValidationDictionary;
