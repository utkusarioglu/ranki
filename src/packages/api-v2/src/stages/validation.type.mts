import type { AstNode, AstNodeLeaf, AstNodeParent } from "./ast.type.mjs";

export interface ParserValidatorFunctionEntry {
  source: string; // name of the plugin
  validate: RankiPluginParserValidationFunc;
}

type ValidationNodeEntryCommon = {
  source: string;
  entry: string;
};

export type ValidationNodeWarningEntry = ValidationNodeEntryCommon;

export type ValidationNodeErrorEntry = ValidationNodeEntryCommon;

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
) => PluginValidationFuncReturn;

export type PluginValidationFuncReturn = {
  warnings: string[];
  errors: string[];
};

export type RankiPluginParserValidationDictionary = Record<
  string,
  RankiPluginParserValidationFunc
>;

export type RankiPluginParserValidationCallback =
  () => RankiPluginParserValidationDictionary;
