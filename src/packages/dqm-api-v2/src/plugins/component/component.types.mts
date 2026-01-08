import type {
  DqmConfig,
  DqmPluginVersion,
  IAstParamNode,
  ICps,
  ITrnNode,
  TransformClass,
} from "../../export.types.mjs";
import type { DeepPartialSerializable } from "../../util.types.mjs";
import type { IDqmPluginExample } from "../examples/example.types.mjs";
import type { Alias, Chain, IdSummary } from "./id/id.types.mjs";

export interface IDqmComponent<
  T extends IComponentCustomizationConfig = IComponentCustomizationConfig,
> {
  type: "component";
  meta: {
    id: IdSummary;
    description: string;
    version: DqmPluginVersion;
    examples?: IDqmPluginExample[];
  };
  customizations: ComponentCustomizations<T>;
  validation: IDqmValidationFunction[];
  transformers: Record<TransformClass, IDqmComponentTransformFunction>;
}

export type IDqmComponentTransformFunction = (trn: ITrnNode) => void;

export type IDqmValidationFunction = (cps: ICps) => void;

export interface ComponentSingleParamSpec {
  id: IdSummary;
}

export interface ChannelParamSpecs {
  positionals: Chain[];
  params: ComponentSingleParamSpec[];
}

// TODO this type is faulty
export interface IComponentCustomizationConfig {
  default: {};
}

export interface ComponentCustomizations<
  T extends IComponentCustomizationConfig = IComponentCustomizationConfig,
> {
  config: {
    dqm?: DeepPartialSerializable<DqmConfig>[];
    // TODO this type is faulty
    component: T & Record<string, object>;
  };
  params: Record<string, ChannelParamSpecs> & {
    default: ChannelParamSpecs;
  };
}

export interface CpsDefinition {
  id: Alias | Chain;
  params: IAstParamNode[];
}
