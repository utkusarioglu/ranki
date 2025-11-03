import type {
  // RankiLanguageMergedConfig,
  RankiLanguageProvidedConfig,
} from "../lang/config.mjs";
// import type { DeepPartial } from "../utils.mjs";
import type { RankiPluginCommon } from "./general.mjs";
import type {
  PluginValidationFuncReturn,
  ValidationNode,
  // ValidationNodeValidationEntry,
} from "../stages/validation.mjs";
import type {
  RankiLangAstContext,
  // RankiLangParseDefinition,
} from "../lang/context.type.mjs";
import type { TransformNode } from "../export.mjs";

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

export type ComponentPluginTransformFuncProps<
  // T extends RankiLangParseDefinition = RankiLangParseDefinition,
> = {
  validation: ValidationNode;
  spec: RankiLangAstContext;
};

export type ComponentPluginTransformFunc = (
  t: ComponentPluginTransformFuncProps,
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
