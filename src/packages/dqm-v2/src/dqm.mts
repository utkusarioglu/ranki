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
  DqmTransformOutput,
  IDqmPlugin,
  IPlugins,
} from "@dqm/package-dqm-api-v2";
import { DqmAppError } from "./errors/dqm-app-error/dqm-app-error.mjs";
import { Unique } from "./unique/unique.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
import type { RenderRoots } from "@dqm/package-dqm-api-v2";
import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";
import type { RenderReport } from "@dqm/package-dqm-api-v2";

export class Dqm {
  private plugins: IPlugins = new Libs();
  private config = new Config();
  private parsed!: DqmParseOutput;
  private transformed!: DqmTransformOutput;

  constructor(configPacks: DqmConfigPack, plugins: IDqmPlugin[]) {
    Unique.reset();
    this.plugins.addPlugins(plugins);
    // plugins.forEach((plugin) => {
    //   this.plugins.addPlugin(plugin);
    // });
    this.buildInitialConfig(configPacks);
  }

  /**
   * @dev
   * #1 I'm not happy with DEFAULT_CONFIG being mutated twice. Correct config
   * shape would allow defining these values at once
   */
  private buildInitialConfig(configPacks: DqmConfigPack) {
    const pluginDefaults =
      this.plugins.getGrammarDefaultConfigs(DEFAULT_CONFIG);
    // #1
    DEFAULT_CONFIG.plugins.config = pluginDefaults.config;
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
    this.ast(rawInputs);
    this.validate();
    this.transform();
    return this.parsed;
  }

  render(
    rawInputs: DqmParseInput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
  ): RenderReport {
    try {
      this.parse(rawInputs);
      return this.plugins.render(this.transformed, roots, pref);
    } catch (e) {
      throw new DqmAppError({
        code: "RENDER_FAIL",
        why: "Something within render logic has failed",
        cause: e,
        details: {
          boundary: true,
        },
      });
    }
  }

  private ast(rawInputs: DqmParseInput): DqmParseOutput {
    try {
      const initial = this.config.getConfig<DqmConfig>(INITIAL_CONFIG_NAME);
      const inputs = this.processInput(rawInputs);
      const { chain } = initial.plugins.default;
      const transports: CommonTransportsConstructorParams = {
        plugins: this.plugins,
        config: this.config,
      };
      this.parsed = inputs.map((input) => {
        return {
          theater: input.theater,
          ast: new AstNode(transports)
            .setNature("synthetic")
            .newCpx((cpx) => cpx.setAstParams([]).setIdList([chain]))
            .setDirection("block")
            .getCpx()!
            .parse(input),
        };
      });
      return this.parsed;
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

  private validate() {
    this.parsed.forEach((v) => {
      const cpx = v.ast.getCpx();
      assertExists(cpx, {
        why: "Parsed asts are expected to have an attached Cpx",
      });
      cpx.getRootCps().validate();
    });
  }

  private transform() {
    this.transformed = this.parsed.map((v) => {
      const cpx = v.ast.getCpx();
      assertExists(cpx, {
        why: "Parsed asts are expected to have an attached Cpx",
      });
      return {
        theater: v.theater,
        trn: cpx
          .getRootCps()
          .transform()
          .map((t) => t.build())
          .flat(),
      };
    });
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
