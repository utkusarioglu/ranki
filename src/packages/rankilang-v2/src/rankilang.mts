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
} from "@ranki/package-api-v2";
import { ast } from "./ast/ast.mjs";
import { ParserPlugins } from "./parser/parser-plugins.mjs";
import { RankiLangConfig } from "./config.mjs";
import { ComponentPlugins } from "./component/component-plugins.mjs";
import { ValidatorLibrary } from "./validator/library.mjs";

export class RankiLang implements RankiLangInstance {
  private config: RankiLangConfig;
  public parsers: ParserPluginsInstance;
  public components: ComponentPluginsInstance;
  private validators = new ValidatorLibrary();

  constructor(
    plugins: RankiLangInstancePluginsRecord,
    provided: RankiLanguageProvidedConfig[],
  ) {
    if (Array.isArray(plugins.parsers)) {
      this.parsers = new ParserPlugins();
      plugins.parsers.forEach((p) => {
        this.parsers.addPlugin(p);
        this.validators.addPlugin(p);
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
  ): RankiLangInstance {
    return new RankiLang(
      { parsers: this.parsers, components: this.components },
      this.config.clone(providedConfigs),
    );
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

    const report: RankiLangParseReport = {
      language: {
        versions: this.parsers.getVersions(),
      },
      config: this.config.getAll(),
      theater: spec.theater,
      role: spec.role,
    };

    const ast = this.createAst(theaterRaw, spec);
    const validation = this.createValidation(ast, spec);
    return {
      report,
      theaters: {
        [spec.theater]: {
          stages: {
            raw: theaterRaw,
            ast: ast.theaters[spec.theater].stages.ast,
            validation,
          },
        },
      },
    };
  }

  private createValidation<T extends RankiLangParseHandlerCommon>(
    ast: RankiLangAstResult,
    spec: RankiLangParseSpecs<T>,
  ) {
    const root = ast.theaters["default"]["stages"]["ast"]["root"];
    return this.validators.validate(root, spec);
  }

  private createAst<T extends RankiLangParseHandlerCommon>(
    theaterRaw: string,
    spec: RankiLangParseSpecs<T>,
  ): RankiLangAstResult {
    if (spec["plugin"]) {
      const parseAstHandler = this.parsers.getHandler(spec["plugin"].type);
      return parseAstHandler(theaterRaw, spec, {
        lang: this,
        clone: this.clone.bind(this),
        parseAst: ast,
        parseValidation: this.validators.validate.bind(this.validators),
      });
    } else {
      return this.parseAstDefault(theaterRaw, spec);
    }
  }

  private parseAstDefault<T extends RankiLangParseHandlerCommon>(
    theaterRaw: string,
    spec: RankiLangParseSpecs<T>,
  ): RankiLangAstResult {
    const contentConfig = this.config.getAll().merged.content;

    const theaterWithContent = [
      contentConfig.prefix,
      theaterRaw,
      contentConfig.suffix,
    ].join("");

    const context: RankiLangAstContext = {
      lang: this,
      blockDepth: spec.blockDepth,
      inlineDepth: spec.inlineDepth,
      theater: spec.theater,
      role: spec.role,
      startRule: spec.startRule,
    };

    const astStage = ast(theaterWithContent, context);
    const validationStage = this.validators.validate(astStage.root, spec);
    return {
      // report,
      theaters: {
        [spec.theater]: {
          stages: {
            raw: theaterWithContent,
            ast: astStage,
            validation: validationStage,
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
