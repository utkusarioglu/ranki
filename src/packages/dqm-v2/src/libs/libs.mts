import type {
  IPlugins,
  IDqmPlugin,
  IDqmComponent,
  Chain,
  Alias,
  DqmConfig,
  CreateParserReturn,
  DqmPluginsConfigDefaults,
  ICpxConstructor,
  IParamConstructor,
  IAstNodeConstructor,
  DqmPluginsTokens,
  DqmInternalConfig,
  ITrnNodeConstructor,
  IDqmRenderEngine,
  RenderRoots,
  IDqmRendererClientPreferences,
  RenderReport,
  DqmSerializeOutput,
  CreatorName,
  IDqmComponentTransformer,
} from "@dqm/package-dqm-api-v2";
import { ComponentLib } from "./component/component-lib.mjs";
import { ParserLib } from "./parser/parser-lib.mjs";
import { Cpx } from "../nodes/cp/cpx/cpx.mjs";
import { AstParamNode } from "../nodes/ast/param/param.mjs";
import { AstNode } from "../nodes/ast/base/ast-node.mjs";
import { DqmAppError } from "../errors/dqm-app-error/dqm-app-error.mjs";
import { TrnNode } from "../nodes/trn/trn.mjs";
import { assertExists, assertNull } from "@dqm/package-dqm-utils";
import {
  assertLeaf,
  assertParent,
  assertExists as exists,
} from "../errors/render-error/assertions.mjs";
import { TransformLib } from "./transform/transform-lib.mjs";

export class Libs implements IPlugins {
  private components = new ComponentLib();
  private transformers = new TransformLib();
  private parsers = new ParserLib();
  private renderEngine: IDqmRenderEngine | null = null;

  addPlugins(plugins: IDqmPlugin[]): void {
    plugins.forEach((plugin) => {
      this.addPlugin(plugin);
    });
  }

  addPlugin(plugin: IDqmPlugin): IPlugins {
    plugin.forEach((entry) => {
      switch (entry.type) {
        case "render-engine":
          assertNull(this.renderEngine, {
            why: "Current only one render engine can be installed",
          });
          this.renderEngine = new entry.engine();
          break;
        case "renderer":
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

  render(
    rawInputs: DqmSerializeOutput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
  ): RenderReport {
    assertExists(this.renderEngine, {
      why: "Cannot render if no rendering engine is installed",
    });
    return this.renderEngine.render(rawInputs, roots, pref, {
      parent: assertParent,
      leaf: assertLeaf,
      exists,
    });
  }

  getTransformer(creator: CreatorName): IDqmComponentTransformer {
    return this.transformers.get({ creator });
  }

  getComponentById(chain: Alias | Chain): IDqmComponent {
    return this.components.get({ id: chain });
  }

  getParser(config: DqmInternalConfig): CreateParserReturn {
    return this.parsers.get({ config });
  }

  getGrammarDefaultConfigs(defaultConfig: DqmConfig): DqmPluginsConfigDefaults {
    return this.parsers.getGrammarDefaultConfigs(defaultConfig);
  }

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

  getTokens(config: DqmConfig): DqmPluginsTokens {
    return this.parsers.getGrammarTokens(config);
  }
}
