import type { CpxParseInput } from "./dqm.types.mjs";
import type { IDqmPlugin, IDqmPluginExtends } from "./plugins/plugin.types.mjs";
import type { IDqmComponent } from "./plugins/component/component-set.types.mjs";
import type {
  Alias,
  Chain,
  ChainList,
} from "./plugins/component/id/id.types.mjs";
import type {
  CpsDefinition,
  CreateParserReturn,
  DqmConfig,
  IAstNode,
  IParam,
} from "./export.types.mjs";

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

export interface ICps {
  hookPlugins(plugins: IPlugins): ICps;
  hookConfig(Config: IConfig): ICps;

  setParent(cps: ICps | null): ICps;
  setDefinition(def: CpsDefinition): ICps;
  setCpx(cpx: ICpx): ICps;

  getCpx(): ICpx;

  parse(input: CpxParseInput): IAstNode;
}

export interface IPluginLib<
  In extends IDqmPluginExtends,
  Out extends any,
  Criteria extends any,
> {
  get(criteria: Criteria): Out;
  add(plugin: In): IPluginLib<In, Out, Criteria>;
}

export interface IPlugins {
  getComponent(id: Chain | Alias): IDqmComponent;
  getParser(name: string, config: DqmConfig): CreateParserReturn;
  addPlugin(plugin: IDqmPlugin): IPlugins;
}

export interface IConfig {
  clone(): IConfig;
  getConfig<T>(code: string): T;
  merge(): IConfig;
}
