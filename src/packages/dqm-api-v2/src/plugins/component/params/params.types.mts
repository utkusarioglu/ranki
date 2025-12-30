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
  // findById(channel: ParamChannel, id: Alias | Chain): ICpsParam | never;
  getParams(): ICpsParam[];
  getChannelNames(): ParamChannel[];
  // getInitialDqmConfig(): DqmConfig;
  getParsedDqmConfig(): DqmConfig;
  initConfig(unique: UniqueValue): this;
  getParsedComponentConfig<T>(): T;
}
