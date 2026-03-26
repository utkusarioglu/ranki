import type {
  DqmConfig,
  DqmInternalConfig,
  DqmGrammarPluginsAggregatedConfig,
  DqmPluginsTokens,
  DqmConfigPackEntryPartial,
} from "../../config/dqm-config.types.mjs";
import type { IAstNodeConstructor } from "../../nodes/ast/base/i-ast-node.types.mjs";
import type { ICpxConstructor } from "../../nodes/cp/export.types.mjs";
import type { IParamConstructor } from "../../nodes/ast/export.types.mjs";
import type {
  IDqmComponent,
  IDqmComponentTransformFunction,
} from "../component/component.types.mjs";
import type { Alias, Chain } from "../component/id/id.types.mjs";
import type { IDqmPlugin, IDqmPluginExtends } from "./plugin.types.mjs";
import type {
  IParser,
  DqmSerializeOutput,
  IDqmRendererClientPreferences,
  RenderReport,
  RenderRoots,
  ITrnNodeConstructor,
  TransformClass,
} from "../../export.types.mjs";
import type { GroupedPluginExamples } from "../examples/example.types.mjs";

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
  add(plugin: In): this;
}

export interface IPluginOptions {
  ignoreRenderPlugins: boolean;
}

export interface IPlugins {
  getComponentById(id: Chain | Alias): IDqmComponent;
  getParser(config: DqmInternalConfig): IParser;
  getGrammarDefaultConfigs(
    defaultConfig: DqmConfig,
  ): DqmGrammarPluginsAggregatedConfig;
  getTokens(config: DqmConfig): DqmPluginsTokens;
  addPlugins(
    plugins: IDqmPlugin[],
    options: DqmConfigPackEntryPartial | undefined,
  ): void;

  getTransformer(
    chain: Chain,
    transformClass: TransformClass,
  ): IDqmComponentTransformFunction;

  render(
    transformOutput: DqmSerializeOutput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
  ): Promise<RenderReport>;

  getPluginExamples(): GroupedPluginExamples;

  // CONSTRUCTORS
  getTrnNodeConstructor(): ITrnNodeConstructor;
  getCpxConstructor(): ICpxConstructor;
  getParamConstructor(): IParamConstructor;
  getAstNodeConstructor(): IAstNodeConstructor;
}
