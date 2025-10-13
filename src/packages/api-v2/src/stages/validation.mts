import type { AstNode } from "./ast.mjs";
// import type { RankiPluginParserValidationFunc } from "../export.mjs";

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

export type ValidationNode = AstNode & {
  validation: ValidationNodeValidationEntry;
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
