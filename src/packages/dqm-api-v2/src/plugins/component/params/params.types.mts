import type { Alias, Chain } from "../id/id.types.mjs";
import type { ComponentParamsSchema } from "../component.types.mjs";
import type { ParamChannel } from "../../../nodes/ast/export.types.mjs";
import type { IAstParamNode, ICpsParam } from "../../../export.types.mjs";

export interface IParams {
  pushParam(param: IAstParamNode): this;
  setSchema(schema: ComponentParamsSchema): this;
  getSchema(): ComponentParamsSchema;
  findById(channel: ParamChannel, id: Alias | Chain): ICpsParam | never;
  getChannelCompilationByChannelName<T>(channel: ParamChannel): T;
  getParams(): ICpsParam[];
  getChannelNames(): ParamChannel[];
}
