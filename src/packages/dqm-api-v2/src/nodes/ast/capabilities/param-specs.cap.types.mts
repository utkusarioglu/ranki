import type { ChannelParamSpecs } from "../../../export.types.mjs";

export interface IAstParamSpecsCapability {
  getSpecs(): ChannelParamSpecs;
  setSpecs(config: ChannelParamSpecs): this;
}
