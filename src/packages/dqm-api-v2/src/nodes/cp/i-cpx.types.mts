import type { CpxParseInput } from "../../dqm.types.mjs";
import type { ChainList } from "../../plugins/component/id/id.types.mjs";
import type { IAstNode, IParam } from "../../export.types.mjs";
import type { ICps } from "./i-cps.types.mjs";
import type { IConfig } from "../../config/i-config.types.mjs";
import type { IPlugins } from "../../plugins/plugin/plugins.types.mjs";

export interface ICpx {
  newChild(): ICpx;
  setIdList(idList: ChainList): ICpx;
  hookPlugins(plugins: IPlugins): ICpx;
  hookConfig(Config: IConfig): ICpx;
  setParent(cpx: ICpx): ICpx;
  getParent(): ICpx;
  parse(input: CpxParseInput): IAstNode;
  setParams(params: IParam[]): ICpx;
  getLeafCps(): ICps;
  getRootCps(): ICps;
}
