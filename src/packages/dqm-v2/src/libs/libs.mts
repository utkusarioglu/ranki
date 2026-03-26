import type {
  IPlugins,
  IDqmPlugin,
  IDqmComponent,
  Chain,
  Alias,
  DqmConfig,
  IParser,
  ICpxConstructor,
  IParamConstructor,
  IAstNodeConstructor,
  DqmPluginsTokens,
  DqmInternalConfig,
  IDqmRenderEngine,
  RenderRoots,
  IDqmRendererClientPreferences,
  RenderReport,
  DqmSerializeOutput,
  IDqmComponentTransformFunction,
  TransformClass,
  DqmGrammarPluginsAggregatedConfig,
  ITrnNodeConstructor,
  DqmConfigPackEntryPartial,
} from "@dqm/package-dqm-api-v2";
import { ComponentLib } from "./component/component-lib.mjs";
import { Cpx } from "../nodes/cp/cpx/cpx.mjs";
import { AstParamNode } from "../nodes/ast/param/param.mjs";
import { AstNode } from "../nodes/ast/base/ast-node.mjs";
import { DqmAppError } from "../errors/dqm-app-error/dqm-app-error.mjs";
import { assertExists, assertNull } from "@dqm/package-dqm-utils";
import {
  assertLeaf,
  assertNever,
  assertParent,
  assertExists as exists,
} from "../errors/render-error/assertions.mjs";
import { TransformLib } from "./transform/transform-lib.mjs";
import { ParserLib } from "./parser/parser-lib.mjs";
import { TrnNode } from "../nodes/trn/trn.mjs";
import type { GroupedPluginExamples } from "@dqm/package-dqm-api-v2";

export class Libs implements IPlugins {
  private readonly parsers = new ParserLib();
  private readonly components = new ComponentLib();
  private readonly transformers = new TransformLib();
  private renderEngine: IDqmRenderEngine | null = null;

  addPlugins(
    plugins: IDqmPlugin[],
    options: DqmConfigPackEntryPartial | undefined,
  ): void {
    plugins.forEach((plugin) => {
      this.addPlugin(plugin, options);
    });
  }

  addPlugin(
    plugin: IDqmPlugin,
    config: DqmConfigPackEntryPartial | undefined,
  ): IPlugins {
    plugin.forEach((entry) => {
      switch (entry.type) {
        case "render-engine":
          if (config?.config.plugins?.ignoreRenderPlugins) break;
          assertNull(this.renderEngine, {
            why: "Current only one render engine can be installed",
          });
          this.renderEngine = new entry.engine({
            parent: assertParent,
            leaf: assertLeaf,
            exists,
            never: assertNever,
          });
          break;
        case "renderer":
          if (config?.config.plugins?.ignoreRenderPlugins) break;
          assertExists(this.renderEngine, {
            why: "Cannot accept renderer plugins before instantiating a rendering engine",
          });
          this.renderEngine.addPlugin(entry);
          break;
        case "component-set":
          this.components.add(entry);
          entry.list.forEach((c) => {
            this.transformers.add(c);
          });
          break;
        case "grammar":
          this.parsers.add(entry);
          break;
        default:
          throw new DqmAppError({
            code: "UNRECOGNIZED_PLUGIN_TYPE",
            why: "Given plugin has an unknown type",
            cause: null,
            details: { plugin, entry },
          });
      }
    });
    return this;
  }

  getPluginExamples(): GroupedPluginExamples {
    return this.components.getPluginExamples();
  }

  render(
    rawInputs: DqmSerializeOutput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
  ): Promise<RenderReport> {
    assertExists(this.renderEngine, {
      why: "Cannot render if no rendering engine is installed",
    });
    return this.renderEngine.render(rawInputs, roots, pref);
  }

  getTransformer(
    chain: Chain,
    transformClass: TransformClass,
  ): IDqmComponentTransformFunction {
    return this.transformers.get({ chain, transformClass });
  }

  getComponentById(chain: Alias | Chain): IDqmComponent {
    return this.components.get({ id: chain });
  }

  getParser(internalConfig: DqmInternalConfig): IParser {
    return this.parsers.get({ internalConfig });
  }

  getGrammarDefaultConfigs(
    defaultConfig: DqmConfig,
  ): DqmGrammarPluginsAggregatedConfig {
    return this.parsers.getGrammarDefaultConfigs(defaultConfig);
  }

  getTokens(config: DqmConfig): DqmPluginsTokens {
    return this.parsers.getGrammarTokens(config);
  }

  // CONSTRUCTORS
  getCpxConstructor(): ICpxConstructor {
    return Cpx;
  }

  getParamConstructor(): IParamConstructor {
    return AstParamNode;
  }

  getAstNodeConstructor(): IAstNodeConstructor {
    return AstNode;
  }

  getTrnNodeConstructor(): ITrnNodeConstructor {
    return TrnNode;
  }
}
