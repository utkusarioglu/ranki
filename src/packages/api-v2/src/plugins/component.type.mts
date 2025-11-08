import type { RankiLanguageProvidedConfig } from "../lang/config.type.mjs";
import type { RankiPluginCommon } from "./general.type.mjs";
import type {
  PluginValidationFuncReturn,
  ValidationNode,
} from "../stages/validation.type.mjs";
import type { TransformNode } from "../export.type.mjs";
import type { AlwaysDot, NoDot } from "../utils.type.mjs";

export interface RankiPluginComponent extends RankiPluginCommon {
  handler: string;
  list: ComponentPluginComponent[];
}

export type ComponentPluginComponentShorthand = Record<string, string[]>;
export type ComponentPluginComponentPositional = string[][];

export type ComponentValidationFuncEntry = {
  source: string;
  code: string;
  chain: ComponentPluginComponent["chain"];
  validate: ComponentPluginValidationFunc;
};

export type ComponentPluginValidationFunc = (
  validation: ValidationNode,
) => PluginValidationFuncReturn;

export type ComponentPluginTransformFunc = (
  validation: ValidationNode,
) => TransformNode[];

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
  chain: ComponentChain;
  aliases: ComponentAlias[];
  stages: {
    preprocess: (raw: string) => string;
    ast: ComponentPluginComponentStageAst;
    validator: ComponentPluginValidationFunc;
    transform: ComponentPluginTransformFunc;
  };
}

export type ComponentAlias = NoDot & { type?: "Component.alias" };
export type ComponentChain = ComponentChainLink[];
export type ComponentRequestName = ComponentChain | ComponentAlias;

export type ComponentChainString = AlwaysDot & {
  type?: "Component.chain.string";
};
export type ComponentChainLink = NoDot & { type?: "Component.chain" };
export type ComponentHandler = NoDot & { type?: "Component.handler" };
