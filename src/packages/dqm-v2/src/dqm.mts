import { Libs } from "./libs/libs.mjs";
import type {
  DqmParseInput,
  DqmConfig,
  IPlugins,
  IDqmPlugin,
  IAstNode,
} from "@dqm/package-dqm-api-v2";
import { Cpx } from "./cp/cpx.mjs";
import { DEFAULT_CONFIG } from "./constants.mjs";
import { Config } from "@dqm/package-utils";

export class Dqm {
  private plugins: IPlugins = new Libs();
  private config = new Config();

  constructor(configs: Record<string, DqmConfig>, plugins: IDqmPlugin[]) {
    plugins.forEach((plugin) => {
      this.plugins.addPlugin(plugin);
    });
    DEFAULT_CONFIG.plugins.config =
      this.plugins.getGrammarDefaultConfigs(DEFAULT_CONFIG);
    this.config.pushConfig("default", DEFAULT_CONFIG);
    Object.entries(configs).forEach(([k, v]) => {
      this.config.pushConfig(k, v);
    });
  }

  private processInput(rawInputs: DqmParseInput) {
    return typeof rawInputs !== "string"
      ? rawInputs
      : {
          inputs: {
            default: rawInputs,
          },
          theater: "default",
          role: "default",
        };
  }

  parse(rawInputs: DqmParseInput): IAstNode {
    const inputs = this.processInput(rawInputs);
    const astNode = new Cpx()
      .hookPlugins(this.plugins)
      .hookConfig(this.config)
      .setParams([])
      .setIdList([["base", "v2", "default"]])
      .parse(inputs);
    return astNode;
  }
}
