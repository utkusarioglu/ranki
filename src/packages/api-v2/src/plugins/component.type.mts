import type {
  // RankiLanguageMergedConfig,
  RankiLanguageProvidedConfig,
} from "../lang/config.type.mjs";
// import type { DeepPartial } from "../utils.mjs";
import type { RankiPluginCommon } from "./general.type.mjs";
import type {
  PluginValidationFuncReturn,
  ValidationNode,
  // ValidationNodeValidationEntry,
} from "../stages/validation.type.mjs";
import type {
  // RankiLangAstContext,
  RankiLangContextInstance,
  // RankiLangParseDefinition,
} from "../lang/context.type.mjs";
import type { TransformNode } from "../export.type.mjs";

export interface RankiPluginComponent extends RankiPluginCommon {
  handler: string;
  list: ComponentPluginComponent[];
}

export type ComponentPluginComponentShorthand = Record<string, string[]>;
export type ComponentPluginComponentPositional = string[][];

// export type ComponentPluginValidationFuncProps =
//   // <
//   // T extends RankiLangParseDefinition = RankiLangParseDefinition,
//   // >
//   {
//     validation: ValidationNode;
//     spec: RankiLangAstContext;
//   };

export type ComponentValidationFuncEntry = {
  source: string;
  code: string;
  chain: ComponentPluginComponent["chain"];
  validate: ComponentPluginValidationFunc;
};

export type ComponentPluginValidationFunc = (
  validation: ValidationNode,
  // spec: RankiLangAstContext,
  // p: ComponentPluginValidationFuncProps,
) => PluginValidationFuncReturn;

// export type ComponentPluginTransformFuncProps =
//   // <
//   // T extends RankiLangParseDefinition = RankiLangParseDefinition,
//   // >
//   {
//     validation: ValidationNode;
//     context: RankiLangContextInstance;
//   };

export type ComponentPluginTransformFunc = (
  validation: ValidationNode,
  context: RankiLangContextInstance,
) => TransformNode;

export type ComponentPluginComponentStageAst = {
  directives: RankiLanguageProvidedConfig[];
  params: {
    setting: {
      positional: ComponentPluginComponentPositional;
      shorthands: ComponentPluginComponentShorthand;
    };
    directive: {
      positional: ComponentPluginComponentPositional;
      shorthands: ComponentPluginComponentShorthand;
    };
  };
};

export interface ComponentPluginComponent {
  chain: string;
  stages: {
    preprocess: (raw: string) => string;
    ast: ComponentPluginComponentStageAst;
    validator: ComponentPluginValidationFunc;
    transform: ComponentPluginTransformFunc;
  };
}
