import type {
  IPlugins,
  IDqmPlugin,
  IDqmComponent,
  Chain,
  Alias,
} from "@ranki/package-dqm-api-v2";
import { DqmError } from "@ranki/package-utils";
import { ComponentLib } from "./component/component-lib.mjs";
import { ParserLib } from "./parser/parser-lib.mjs";

export class Libs implements IPlugins {
  private components = new ComponentLib();
  private parsers = new ParserLib();

  addPlugin(plugin: IDqmPlugin): IPlugins {
    plugin.forEach((entry) => {
      switch (entry.type) {
        case "component-set":
          this.components.add(entry);
          break;
        case "parser":
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

  // getParser(def) {}
}
