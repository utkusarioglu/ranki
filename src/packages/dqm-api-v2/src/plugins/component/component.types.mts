import type {
  DqmConfig,
  DqmPluginVersion,
  IAstParamNode,
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
}

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
