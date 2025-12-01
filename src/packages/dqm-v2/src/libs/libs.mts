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
} from "@dqm/package-dqm-api-v2";
import { DqmError } from "@dqm/package-utils";
import { ComponentLib } from "./component/component-lib.mjs";
import { ParserLib } from "./parser/parser-lib.mjs";
import { Cpx } from "../cp/cpx.mjs";

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
          throw new DqmError("UNRECOGNIZED_PLUGIN_TYPE", { plugin, entry });
      }
    });
    return this;
  }

  getComponent(chain: Alias | Chain): IDqmComponent {
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
}
