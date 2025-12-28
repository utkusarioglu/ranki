import type { Alias, Chain } from "../id/id.types.mjs";
import type { ComponentCustomizations } from "../component.types.mjs";
import type { ParamChannel } from "../../../nodes/ast/export.types.mjs";
import type {
  DqmConfig,
  IAstParamNode,
  ICpsParam,
} from "../../../export.types.mjs";

export interface IParams {
  pushParam(param: IAstParamNode): this;
  setSchema(schema: ComponentCustomizations): this;
  getSchema(): ComponentCustomizations;
  findById(channel: ParamChannel, id: Alias | Chain): ICpsParam | never;
  getChannelCompilation<T>(channel: ParamChannel): T;
  getParams(): ICpsParam[];
  getChannelNames(): ParamChannel[];
  createMergedConfig(): void;
  getMergedConfig(): DqmConfig;
  createInitialConfig(): void;
}
