import type {
  RankiLanguageConfig,
  RankiLangInstance,
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLanguageProvidedConfig,
  RankiLangParseReport,
  ParserPluginsInstance,
  ComponentPluginsInstance,
  RankiLangInstancePluginsRecord,
  RankiLangParseHandlerHooks,
  RankiLangCloneFunctionReturn,
  RankiLangContextInstance,
} from "@ranki/package-api-v2";
import { ParserPlugins } from "./stages/parser/parser-plugins.mjs";
import { RankiLangConfig } from "./config.mjs";
import { ComponentPlugins } from "./component/component-plugins.mjs";
import { ValidatorLibrary } from "./stages/validator/library.mjs";
import { TransformerLibrary } from "./stages/transformer/transformer.mjs";
import { AstLibrary } from "./stages/ast/library.mjs";
import { RankiLangContext } from "./context/context.mjs";

export class RankiLang implements RankiLangInstance {
  private config: RankiLangConfig;
  public components: ComponentPluginsInstance;
  public parsers: ParserPluginsInstance;

  private validators = new ValidatorLibrary();
  private transformers = new TransformerLibrary();
  private ast = new AstLibrary();

  constructor(
    plugins: RankiLangInstancePluginsRecord,
    provided: RankiLanguageProvidedConfig[],
  ) {
    if (Array.isArray(plugins.parsers)) {
      this.parsers = new ParserPlugins();
      plugins.parsers.forEach((p) => {
        this.parsers.addPlugin(p);
        this.validators.addPlugin(p);
        this.transformers.addPlugin(p);
      });
    } else {
      this.parsers = plugins.parsers;
    }

    if (Array.isArray(plugins.components)) {
      this.components = new ComponentPlugins();
      plugins.components.forEach((p) => this.components.addPlugin(p));
    } else {
      this.components = plugins.components;
    }

    this.config = new RankiLangConfig(this.parsers.produceConfig(), provided);
  }

  getConfig() {
    return this.config.getAll();
  }

  getPlugins() {
    return this.parsers;
  }

  private cloneLang(
    providedConfigs: RankiLanguageProvidedConfig[] | null,
  ): RankiLangCloneFunctionReturn {
    const lang = new RankiLang(
      { parsers: this.parsers, components: this.components },
      this.config.clone(providedConfigs),
    );
    const hooks = lang.createParseHandlerHooks();
    return {
      lang,
      hooks,
    };
  }

  private createParseHandlerHooks() {
    const parseHandlerHooks: RankiLangParseHandlerHooks = {
      getPlugins: this.getPlugins.bind(this),
      cloneLang: this.cloneLang.bind(this),
      getComponent: this.components.getPlugin.bind(this.components),
      parseAst: this.ast.parse.bind(this.ast),
      getHandler: this.parsers.getHandler.bind(this.parsers),
      getConfig: this.config.getAll.bind(this.config),
      createParser: this.ast.createParser.bind(this.ast),
    };
    return parseHandlerHooks;
  }

  parse(
    raw: Record<string, string>,
    spec: RankiLangParseSpecs = {
      theater: "default",
      role: "default",
    },
  ): RankiLangParseResult {
    const theaterRaw = raw[spec.theater];

    if (theaterRaw === undefined) {
      throw new Error(`THEATER UNDEFINED: ${spec.theater}`);
    }

    const config = this.config.getAll();

    const context: RankiLangContextInstance = new RankiLangContext({
      theater: spec.theater,
      role: spec.role,
      hooks: this.createParseHandlerHooks(),
    }).switchParser({
      type: "RankiBaseV2",
      chain: [[]],
      params: [],
    });

    // const ast = this.ast.parse(
    //   theaterRaw,
    //   {
    //     type: "RankiBaseV2",
    //     chain: [[]],
    //     params: [],
    //   },
    //   context,
    // );
    const ast = context.parseAst(theaterRaw);

    const validation = ["validate", "transform"].includes(config.merged.stage)
      ? this.validators.validate(ast.ast.root, context)
      : null;

    const transform =
      validation && config.merged.stage === "transform"
        ? this.transformers.transform(validation, context)
        : null;

    const report: RankiLangParseReport = {
      language: {
        versions: this.parsers.getVersions(),
      },
      ast: this.ast.getReports(),
      theater: spec.theater,
      role: spec.role,
    };

    return {
      report,
      theaters: {
        [spec.theater]: {
          stages: {
            raw: theaterRaw,
            ast: {
              root: ast.ast.root,
            },
            validation,
            transform,
          },
        },
      },
    };
  }
}

export interface ParseContext {
  config: RankiLanguageConfig;
  lang: RankiLang;
}
