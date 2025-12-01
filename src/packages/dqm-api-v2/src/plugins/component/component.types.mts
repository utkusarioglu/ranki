import type { Alias, Chain, IdSummary } from "./id/id.types.mjs";
import type { IParam, ParamType, ParamValue } from "./params/param.types.mjs";

export interface IDqmComponent {
  type: "component";
  meta: {
    id: IdSummary;
    description: string;
    version: string;
  };
  stages: {
    preprocessing?: (v: string) => string;
    ast: ComponentParamsSchema;
  };
}

export interface ParamDefaultValue {
  name: string;
  type: ParamType;
  defaultValue: ParamValue;
}

export interface ComponentSingleParamSpec {
  id: IdSummary;
  values: ParamDefaultValue[];
}

export interface ChannelParamSpecs {
  positionals: (Chain | Alias)[];
  params: ComponentSingleParamSpec[];
}

export interface ComponentParamsSchema {
  settings: ChannelParamSpecs;
  configs: ChannelParamSpecs;
}

export interface CpsDefinition {
  id: Alias | Chain;
  params: IParam[];
}
