import type {
  IDqmPluginExtends,
  Chain,
  Alias,
  IDqmComponent,
  DqmConfig,
  CreateParserReturn,
  IDqmPlugin,
  DqmPluginsConfigDefaults,
  ICpxConstructor,
} from "../../export.types.mjs";

/**
 * Provides a common surface area for Plugin libraries such as component and parser
 * @dev
 * The existence of this interface is contentious. It's not clear whether this
 * interface could serve any real purpose in the future. It certainly doesn't
 * serve one right now at the current scale of the repo.
 */
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
  getGrammarDefaultConfigs(defaultConfig: DqmConfig): DqmPluginsConfigDefaults;
  getCpxConstructor(): ICpxConstructor;
}
