import type { ComponentCustomizations } from "../component.types.mjs";
import type {
  DqmConfig,
  IAstParamNode,
  ICpsParam,
  ParamChannel,
  UniqueValue,
} from "../../../export.types.mjs";

export interface IParams {
  pushParam(param: IAstParamNode): this;
  setSchema(schema: ComponentCustomizations): this;
  getSchema(): ComponentCustomizations;
  getParams(): ICpsParam[];
  getChannelNames(): ParamChannel[];
  getParsedDqmConfig(): DqmConfig;
  initConfig(unique: UniqueValue): this;
  getParsedComponentConfig<T>(): T;
}
