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
} from "@dqm/package-dqm-api-v2";
import { ComponentLib } from "./component/component-lib.mjs";
import { ParserLib } from "./parser/parser-lib.mjs";
import { Cpx } from "../nodes/cp/cpx/cpx.mjs";
import { AstParamNode } from "../nodes/ast/param/param.mjs";
import { AstNode } from "../nodes/ast/base/ast-node.mjs";
import { DqmAppError } from "../errors/dqm-app-error/dqm-app-error.mjs";

export class Libs implements IPlugins {
  private components = new ComponentLib();
  private parsers = new ParserLib();

  addPlugin(plugin: IDqmPlugin): IPlugins {
    plugin.forEach((entry) => {
      switch (entry.type) {
        case "component-set":
          this.components.add(entry);
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

  getComponentById(chain: Alias | Chain): IDqmComponent {
    return this.components.get({ id: chain });
  }

  getParser(name: string, config: DqmConfig): CreateParserReturn {
    return this.parsers.get({ name, config });
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
}
