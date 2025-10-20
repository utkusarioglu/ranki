import type {
  RankiLanguageConfig,
  RankiLangInstance,
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLangAstContext,
  RankiLanguageProvidedConfig,
  RankiLangParseReport,
  RankiLangParseHandlerCommon,
  ParserPluginsInstance,
  ComponentPluginsInstance,
  RankiLangInstancePluginsRecord,
  RankiLangAstResult,
  RankiLangParsedAst,
  RankiLangParseHandlerHooks,
  RankiLangCloneFunctionReturn,
} from "@ranki/package-api-v2";
import { ParserPlugins } from "./parser/parser-plugins.mjs";
import { RankiLangConfig } from "./config.mjs";
import { ComponentPlugins } from "./component/component-plugins.mjs";
import { ValidatorLibrary } from "./validator/library.mjs";
import { TransformerLibrary } from "./transformer/transformer.mjs";
import { AstLibrary } from "./ast/library.mjs";

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

  private clone(
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
      clone: this.clone.bind(this),
      parseAst: this.ast.parse.bind(this.ast),
      getComponent: this.components.getPlugin.bind(this.components),
      getHandler: this.parsers.getHandler.bind(this.parsers),
      getConfig: this.config.getAll.bind(this.config),
    };
    return parseHandlerHooks;
  }

  parse<T extends RankiLangParseHandlerCommon>(
    raw: Record<string, string>,
    spec: RankiLangParseSpecs<T> = {
      theater: "default",
      role: "default",
      // TODO these values are only relevant to frames, maybe they should be in the frame specification
      blockDepth: 0,
      inlineDepth: 0,
      // TODO this one is root if we are at the root and is the frame's default, so maybe this doesn't need to be here
      startRule: "root",
    },
  ): RankiLangParseResult {
    const theaterRaw = raw[spec.theater];

    if (theaterRaw === undefined) {
      throw new Error(`THEATER UNDEFINED: ${spec.theater}`);
    }

    const config = this.config.getAll();

    const report: RankiLangParseReport = {
      language: {
        versions: this.parsers.getVersions(),
      },
      config,
      theater: spec.theater,
      role: spec.role,
    };

    const context: RankiLangAstContext = {
      ...spec,
      hooks: this.createParseHandlerHooks(),
    };

    const ast = this.ast.parse(theaterRaw, context);

    const validation = ["validate", "transform"].includes(config.merged.stage)
      ? this.validators.validate(ast.root, spec)
      : null;

    const transform =
      validation && config.merged.stage === "transform"
        ? this.transformers.transform(validation, spec, {
            getComponent: this.components.getPlugin.bind(this.components),
          })
        : null;

    return {
      report,
      theaters: {
        [spec.theater]: {
          stages: {
            raw: theaterRaw,
            ast,
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
