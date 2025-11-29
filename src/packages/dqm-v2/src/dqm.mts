import { Libs } from "./libs/libs.mjs";
import type {
  DqmParseInput,
  DqmConfig,
  IPlugins,
  IDqmPlugin,
} from "@ranki/package-dqm-api-v2";
import { Cpx } from "./cp/cpx.mjs";
import { DEFAULT_CONFIG } from "./constants.mjs";
import { Config } from "@ranki/package-utils";

export class Dqm {
  private plugins: IPlugins = new Libs();
  private config = new Config<DqmConfig>();

  constructor(configs: Record<string, DqmConfig>, plugins: IDqmPlugin[]) {
    this.config.addConfig("default", DEFAULT_CONFIG);
    Object.entries(configs).forEach(([k, v]) => {
      this.config.addConfig(k, v);
    });
    plugins.forEach((plugin) => {
      this.plugins.addPlugin(plugin);
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

  parse(rawInputs: DqmParseInput) {
    const inputs = this.processInput(rawInputs);
    const cpx = new Cpx()
      .hookPlugins(this.plugins)
      .hookConfig(this.config)
      .setIdList([["base", "v2", "default"]])
      .setParams([])
      .parse(inputs);
    console.log(inputs, cpx);
    return cpx;
  }
}
