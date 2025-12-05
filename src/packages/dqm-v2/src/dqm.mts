import { Libs } from "./libs/libs.mjs";
import type {
  DqmParseInput,
  IPlugins,
  IDqmPlugin,
  CommonTransportsConstructorParams,
  DqmConfigPack,
  DqmParseInputStructured,
  DqmParseRole,
  DqmParseTheater,
  DqmParseInputString,
  DqmParseOutput,
  ChainList,
  IParam,
} from "@dqm/package-dqm-api-v2";
import { DEFAULT_CONFIG } from "./constants.mjs";
import { AstNode } from "./nodes/ast/ast-node.mjs";
import { Config } from "@dqm/package-utils";

export class Dqm {
  private plugins: IPlugins = new Libs();
  private config = new Config();

  /**
   * @dev
   * #1 I'm not happy with DEFAULT_CONFIG being mutated twice. Correct config
   * shape would allow defining these values at once
   */
  constructor(configs: DqmConfigPack, plugins: IDqmPlugin[]) {
    plugins.forEach((plugin) => {
      this.plugins.addPlugin(plugin);
    });
    const pluginDefaults =
      this.plugins.getGrammarDefaultConfigs(DEFAULT_CONFIG);
    // #1
    DEFAULT_CONFIG.plugins.config = pluginDefaults.config;
    DEFAULT_CONFIG.grammar.tokens = pluginDefaults.tokens;
    this.config.pushConfig("default", DEFAULT_CONFIG);
    Object.entries(configs).forEach(([k, v]) => {
      this.config.pushConfig(k, v);
    });
  }

  private processInput(rawInputs: DqmParseInput): DqmParseInputStructured {
    return Array.isArray(rawInputs)
      ? rawInputs
      : [
          {
            theater: "default",
            dqm: rawInputs,
          },
        ];
  }

  parse(rawInputs: DqmParseInput): DqmParseOutput {
    const inputs = this.processInput(rawInputs);
    const component: ChainList = [["base", "v2", "default"]];
    const params: IParam[] = [];
    const transports: CommonTransportsConstructorParams = {
      plugins: this.plugins,
      config: this.config,
    };
    const parsed = inputs.map((input) => {
      return {
        theater: input.theater,
        ast: new AstNode(transports)
          .setNature("synthetic")
          .newCpx((cpx) => cpx.setParams(params).setIdList(component))
          .setDirection("block")
          .getCpx()
          .parse(input),
      };
    });

    return parsed;
  }
}

// TODO this needs its own module
// TODO dqm should import all the types necessary for a consumer. The consumer shouldn't have to know about the api package.
export type {
  DqmParseTheater,
  DqmParseRole,
  DqmParseInput,
  DqmParseInputString,
  DqmParseInputStructured,
  DqmParseOutput,
};
