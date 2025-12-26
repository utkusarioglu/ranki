import { Libs } from "./libs/libs.mjs";
import {
  DEFAULT_CONFIG,
  DEFAULT_CONFIG_NAME,
  INITIAL_CONFIG_NAME,
} from "./constants.mjs";
import { AstNode } from "./nodes/ast/base/ast-node.mjs";
import { Config } from "@dqm/package-dqm-utils";
import type {
  CommonTransportsConstructorParams,
  DqmConfig,
  DqmConfigPack,
  DqmParseInput,
  DqmParseInputString,
  DqmParseInputStructured,
  DqmParseOutput,
  DqmParseRole,
  DqmParseTheater,
  IDqmPlugin,
  IPlugins,
} from "@dqm/package-dqm-api-v2";
import { DqmAppError } from "./errors/dqm-app-error/dqm-app-error.mjs";
import { Unique } from "./unique/unique.mjs";

export class Dqm {
  private plugins: IPlugins = new Libs();
  private config = new Config();

  /**
   * @dev
   * #1 I'm not happy with DEFAULT_CONFIG being mutated twice. Correct config
   * shape would allow defining these values at once
   */
  constructor(configPacks: DqmConfigPack, plugins: IDqmPlugin[]) {
    Unique.reset();
    plugins.forEach((plugin) => {
      this.plugins.addPlugin(plugin);
    });
    const pluginDefaults =
      this.plugins.getGrammarDefaultConfigs(DEFAULT_CONFIG);
    // #1
    DEFAULT_CONFIG.plugins.config = pluginDefaults.config;
    DEFAULT_CONFIG.grammar.tokens = pluginDefaults.tokens;
    this.config.pushConfig(DEFAULT_CONFIG_NAME, DEFAULT_CONFIG);
    configPacks.map(({ id, config }) => {
      this.config.pushConfig(id, config);
    });
    this.config.mergeTo(INITIAL_CONFIG_NAME);
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
    try {
      const initial = this.config.getConfig<DqmConfig>(INITIAL_CONFIG_NAME);
      const inputs = this.processInput(rawInputs);
      const { chain, params } = initial.plugins.defaultComponent;
      const transports: CommonTransportsConstructorParams = {
        plugins: this.plugins,
        config: this.config,
      };
      const parsed = inputs.map((input) => {
        return {
          theater: input.theater,
          ast: new AstNode(transports)
            .setNature("synthetic")
            .newCpx((cpx) => cpx.setAstParams(params).setIdList([chain]))
            .setDirection("block")
            .getCpx()!
            .parse(input),
        };
      });
      return parsed;
    } catch (e) {
      throw new DqmAppError({
        code: "PARSE_FAIL",
        why: "Something within parse logic has failed",
        cause: e,
        details: {
          boundary: true,
        },
      });
    }
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
