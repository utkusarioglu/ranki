import type { RankiLanguageMergedConfig } from "../lang/config.mjs";
import type { DeepPartial } from "../utils.mjs";
import type { RankiPluginCommon } from "./general.mjs";
import type {
  ValidationNode,
  ValidationNodeValidationEntry,
} from "../stages/validation.mjs";
import type {
  RankiLangAstContext,
  RankiLangParseHandlerCommon,
} from "../lang/context.mjs";
import type { TransformNode } from "../export.mjs";

export interface RankiPluginComponent extends RankiPluginCommon {
  handler: string;
  list: ComponentPluginComponent[];
}

export type ComponentPluginComponentShorthand = Record<string, string[]>;
export type ComponentPluginComponentPositional = string[][];

export type ComponentPluginValidationFuncProps<
  T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = {
  validation: ValidationNode;
  spec: RankiLangAstContext<T>;
};

export type ComponentPluginValidationFunc = (
  p: ComponentPluginValidationFuncProps,
) => ValidationNodeValidationEntry;

export type ComponentPluginTransformFuncProps<
  T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = {
  validation: ValidationNode;
  spec: RankiLangAstContext<T>;
};

export type ComponentPluginTransformFunc = (
  t: ComponentPluginTransformFuncProps,
) => TransformNode;

export interface ComponentPluginComponent {
  chain: string;
  stages: {
    preprocess: (raw: string) => string;
    ast: {
      directives: DeepPartial<RankiLanguageMergedConfig>;
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
    validation: ComponentPluginValidationFunc;
    transform: ComponentPluginTransformFunc;
  };
}
