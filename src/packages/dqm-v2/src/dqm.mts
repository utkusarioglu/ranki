import { Libs } from "./libs/libs.mjs";
import type {
  DqmParseInput,
  IPlugins,
  IDqmPlugin,
  IAstNode,
  CommonTransportsConstructorParams,
  DqmConfigPack,
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
    const transports: CommonTransportsConstructorParams = {
      plugins: this.plugins,
      config: this.config,
    };
    const astNode = new AstNode(transports)
      .setNature("synthetic")
      .newCpx((cpx) => cpx.setParams([]).setIdList([["base", "v2", "default"]]))
      .setDirection("block")
      .getCpx()
      .parse(inputs);
    return astNode;
  }
}
