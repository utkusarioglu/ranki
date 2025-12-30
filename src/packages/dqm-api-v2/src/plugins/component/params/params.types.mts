import type { Alias, Chain } from "../id/id.types.mjs";
import type { ComponentCustomizations } from "../component.types.mjs";
import type { ParamChannel } from "../../../nodes/ast/export.types.mjs";
import type {
  DqmConfig,
  IAstParamNode,
  ICpsParam,
  UniqueValue,
} from "../../../export.types.mjs";

export interface IParams {
  pushParam(param: IAstParamNode): this;
  setSchema(schema: ComponentCustomizations): this;
  getSchema(): ComponentCustomizations;
  findById(channel: ParamChannel, id: Alias | Chain): ICpsParam | never;
  getParams(): ICpsParam[];
  getChannelNames(): ParamChannel[];
  getInitialDqmConfig(): DqmConfig;
  getDqmConfig(): DqmConfig;
  initConfig(unique: UniqueValue): this;
  getComponentConfig<T>(): T;
}
