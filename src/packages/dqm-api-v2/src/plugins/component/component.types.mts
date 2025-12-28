import type { DqmPluginVersion, IAstParamNode } from "../../export.types.mjs";
import type { Alias, Chain, IdSummary } from "./id/id.types.mjs";

export interface IDqmComponent {
  type: "component";
  meta: {
    id: IdSummary;
    description: string;
    version: DqmPluginVersion;
  };
  customizations: ComponentCustomizations;
  stages: {
    preprocessing?: (v: string) => string;
  };
}

export interface ParamDefaultValue {
  name: string; // this is for displaying a name in user instructions
  type: string;
  defaultValue: unknown;
}

export interface ComponentSingleParamSpec {
  id: IdSummary;
  values: ParamDefaultValue[];
}

export interface ChannelParamSpecs {
  positionals: Chain[];
  params: ComponentSingleParamSpec[];
}

export interface ComponentCustomizations {
  params: Record<string, ChannelParamSpecs> & {
    default: ChannelParamSpecs;
  };
  config: Record<string, any[]> & { default: any[] };
}

export interface CpsDefinition {
  id: Alias | Chain;
  params: IAstParamNode[];
}
