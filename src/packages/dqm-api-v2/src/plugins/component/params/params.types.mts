import type { Alias, Chain } from "../id/id.types.mjs";
import type { ComponentParamsSchema } from "../component.types.mjs";
import type { IParam, ParamChannel } from "./param.types.mjs";

export interface IParams {
  pushParam(param: IParam): this;
  setSchema(schema: ComponentParamsSchema): this;
  getSchema(): ComponentParamsSchema;
  findById(channel: ParamChannel, id: Alias | Chain): IParam | never;
  buildObject<T>(channel: ParamChannel): T;
}
