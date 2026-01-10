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
  DqmParseInputStructured,
  DqmParseOutput,
  DqmSerializeOutput,
  DqmTransformOutput,
  GroupedPluginExamples,
  IDqmPlugin,
  IPlugins,
} from "@dqm/package-dqm-api-v2";
import { DqmAppError } from "./errors/dqm-app-error/dqm-app-error.mjs";
import { Unique } from "./unique/unique.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
import type { RenderRoots } from "@dqm/package-dqm-api-v2";
import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";
import type { RenderReport } from "@dqm/package-dqm-api-v2";
import { DqmTransformer } from "./transform.mjs";
import { Cpx } from "./nodes/cp/cpx/cpx.mjs";

export class Dqm {
  private plugins: IPlugins = new Libs();
  private config = new Config();
  private parsed!: DqmParseOutput;
  private transformed!: DqmTransformOutput;
  private serialized!: DqmSerializeOutput;

  constructor(configPacks: DqmConfigPack, plugins: IDqmPlugin[]) {
    Unique.reset();
    this.plugins.addPlugins(plugins);
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
    DEFAULT_CONFIG.plugins.config = pluginDefaults;
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
    this.serialize();
    return this.parsed;
  }

  getPluginExamples(): GroupedPluginExamples {
    return this.plugins.getPluginExamples();
  }

  render(
    rawInputs: DqmParseInput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
  ): RenderReport {
    try {
      this.parse(rawInputs);
      return this.plugins.render(this.serialized, roots, pref);
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

  private getTransports(): CommonTransportsConstructorParams {
    return {
      plugins: this.plugins,
      config: this.config,
    };
  }

  private ast(rawInputs: DqmParseInput): DqmParseOutput {
    try {
      const initial = this.config.getConfig<DqmConfig>(INITIAL_CONFIG_NAME);
      const inputs = this.processInput(rawInputs);
      const { chain } = initial.plugins.default;
      const transports = this.getTransports();
      this.parsed = inputs.map((input) => {
        const cpx = new Cpx(transports).setAstParams([]).setIdList([chain]);
        const ast = new AstNode(transports);
        cpx.setRootAst(ast);
        ast
          .setNature("synthetic")
          .setCpx(cpx)
          // .newCpx((cpx) => cpx.setAstParams([]).setIdList([chain]))
          .setDirection("block");
        const parsedAst = cpx.parse(input);
        return {
          theater: input.theater,
          ast: parsedAst,
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
    this.transformed = new DqmTransformer(this.getTransports()).transform(
      this.parsed,
    );
    // this.transformed = transform(this.parsed, this.getTransports());
  }

  private serialize() {
    this.serialized = this.transformed.map(({ theater, tCpx }) => ({
      theater,
      serialized: tCpx.serialize({
        props: ["component", "dqm", "astRootCreator"],
      }),
    }));
    // console.log("serialized", this.serialized);
  }
}
