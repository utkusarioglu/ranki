import type {
  DqmConfig,
  DqmPluginsConfigDefaults,
} from "../../config/dqm-config.types.mjs";
import type { IAstNodeConstructor } from "../../nodes/ast/ast-node.types.mjs";
import type { ICpxConstructor } from "../../nodes/cp/export.types.mjs";
import type { IParamConstructor } from "../../nodes/param/param-node.types.mjs";
import type { IDqmComponent } from "../component/component.types.mjs";
import type { Alias, Chain } from "../component/id/id.types.mjs";
import type { CreateParserReturn } from "./parser/parser.types.mjs";
import type { IDqmPlugin, IDqmPluginExtends } from "./plugin.types.mjs";

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
  getComponentById(id: Chain | Alias): IDqmComponent;
  getParser(name: string, config: DqmConfig): CreateParserReturn;
  addPlugin(plugin: IDqmPlugin): IPlugins;
  getGrammarDefaultConfigs(defaultConfig: DqmConfig): DqmPluginsConfigDefaults;
  getCpxConstructor(): ICpxConstructor;
  getParamConstructor(): IParamConstructor;
  getAstNodeConstructor(): IAstNodeConstructor;
}
