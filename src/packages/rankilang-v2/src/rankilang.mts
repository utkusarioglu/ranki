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
  RankiLangContextInstance,
  RankiLangParsedTheater,
  RankiLangAstResultTheaters,
} from "@ranki/package-api-v2";
import { ParserPlugins } from "./stages/parser/parser-plugins.mjs";
import { RankiLangConfig } from "./config.mjs";
import { ComponentPlugins } from "./component/component-plugins.mjs";
import { ValidatorLibrary } from "./stages/validator/library.mjs";
// import { TransformerLibrary } from "./stages/transformer/transformer.mjs";
import { AstLibrary } from "./stages/ast/library.mjs";
import { RankiLangContext } from "./context/context.mjs";

export class RankiLang implements RankiLangInstance {
  // parse stage
  private astLibrary: AstLibrary;
  public components: ComponentPluginsInstance;
  private config: RankiLangConfig;
  public parsers: ParserPluginsInstance;

  // validation
  private validators = new ValidatorLibrary();
  // transform
  // private transformers = new TransformerLibrary();

  private provided: RankiLanguageProvidedConfig[];

  constructor(
    plugins: RankiLangInstancePluginsRecord,
    provided: RankiLanguageProvidedConfig[],
  ) {
    if (Array.isArray(plugins.parsers)) {
      this.parsers = new ParserPlugins();
      plugins.parsers.forEach((p) => {
        this.parsers.addPlugin(p);
        this.validators.addParser(p);
        // this.transformers.addPlugin(p);
      });
    } else {
      this.parsers = plugins.parsers;
    }

    if (Array.isArray(plugins.components)) {
      this.components = new ComponentPlugins();
      plugins.components.forEach((component) => {
        this.components.addPlugin(component);
        this.validators.addComponent(component);
      });
    } else {
      this.components = plugins.components;
    }

    this.astLibrary = new AstLibrary(this.parsers);
    this.config = new RankiLangConfig(this.parsers.produceConfig(), provided);
    this.provided = provided;
  }

  getConfig() {
    return this.config.getAll();
  }

  getPlugins() {
    return this.parsers;
  }

  parse(
    raw: Record<string, string>,
    spec: RankiLangParseSpecs = {
      theater: "default",
      role: "default",
    },
  ): RankiLangParseResult {
    const report: RankiLangParseReport = {
      language: {
        versions: this.parsers.getVersions(),
      },
      ast: this.astLibrary.getReports(),
      theater: spec.theater,
      role: spec.role,
    };

    const theaters = Object.entries(raw).reduce(
      (a, [theaterName, raw]) => (
        (a[theaterName] = this.parseTheater(theaterName, raw, spec)), a
      ),
      {} as RankiLangAstResultTheaters,
    );

    return {
      report,
      theaters,
    };
  }

  private parseTheater(
    _theaterName: string,
    theaterRaw: string,
    spec: RankiLangParseSpecs,
  ): RankiLangParsedTheater {
    // const config = this.config.getAll();

    const context: RankiLangContextInstance = new RankiLangContext(spec, {
      ast: this.astLibrary,
      components: this.components,
      parsers: this.parsers,
      config: this.config,
      validators: this.validators,
      // transformers: this.transformers,
    })
      .newBoundary({
        type: "RankiBaseV2",
        chain: [["default"]],
        params: [],
      })
      .replaceProvidedConfig(this.provided);

    const ast = context.parseAst(theaterRaw);
    const validation = context.parseValidation(ast);
    const transform = context.parseTransform(validation);

    return {
      stages: {
        raw: theaterRaw,
        ast: ast,
        validation,
        transform,
      },
    };
  }
}

export interface ParseContext {
  config: RankiLanguageConfig;
  lang: RankiLang;
}
