import type {
  DqmConfig,
  DqmPluginVersion,
  IAstParamNode,
  ICps,
  ITrnCpsRootNode,
} from "../../export.types.mjs";
import type { DeepPartialSerializable } from "../../util.types.mjs";
import type { Alias, Chain, IdSummary } from "./id/id.types.mjs";

export interface IDqmComponent<T = any> {
  type: "component";
  meta: {
    id: IdSummary;
    description: string;
    version: DqmPluginVersion;
  };
  customizations: ComponentCustomizations<T>;
  validation: IDqmValidationFunction[];
  // transformer: IDqmComponentTransformFunction;
  transformers: Record<TransformClass, IDqmComponentTransformFunction>;
}

export type TransformClass = string & { type?: "TransformClass" };

export type IDqmComponentTransformFunction = (trnCps: ITrnCpsRootNode) => void;

export type IDqmValidationFunction = (cps: ICps) => void;

export interface ComponentSingleParamSpec {
  id: IdSummary;
}

export interface ChannelParamSpecs {
  positionals: Chain[];
  params: ComponentSingleParamSpec[];
}

export interface ComponentCustomizations<T = any> {
  config: {
    dqm?: DeepPartialSerializable<DqmConfig>[];
    component: {
      default: T;
    } & Record<string, T>;
  };
  params: Record<string, ChannelParamSpecs> & {
    default: ChannelParamSpecs;
  };
}

export interface CpsDefinition {
  id: Alias | Chain;
  params: IAstParamNode[];
}
