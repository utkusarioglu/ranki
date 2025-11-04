// import type { RankiLangContextInstance } from "../export.type.mjs";
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

interface ValidationNodeCommon {
  // context: RankiLangContextInstance;
  validation: ValidationNodeValidationEntry;
}

export type ValidationNode = ValidationNodeParent | ValidationNodeLeaf;

export type ValidationNodeLeaf = AstNodeLeaf & ValidationNodeCommon & {};

export type ValidationNodeParent = Omit<AstNodeParent, "children"> &
  ValidationNodeCommon & {
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
