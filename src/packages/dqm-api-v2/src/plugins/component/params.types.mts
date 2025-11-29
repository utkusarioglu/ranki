import type { Alias, Chain } from "./id/id.types.mjs";
import type { ComponentParamsSchema } from "./component.types.mjs";
import type { IParam, ParamChannel } from "./param.types.mjs";

export interface IParams {
  addParam(param: IParam): IParams;
  setSchema(schema: ComponentParamsSchema): IParams;
  getSchema(): ComponentParamsSchema;
  findById(channel: ParamChannel, id: Alias | Chain): IParam | never;
}
