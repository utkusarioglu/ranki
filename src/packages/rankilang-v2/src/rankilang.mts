import type {
  RankiLanguageConfig,
  RankiLangInstance,
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLangAstContext,
  RankiLanguageProvidedConfig,
  RankiLangParseReport,
} from "@ranki/package-api-v2";
import { ast } from "./ast/ast.mjs";
import { ParserPlugins } from "./parser/parser-plugins.mjs";
import { RankiLangConfig } from "./config.mjs";
import { ComponentPlugins } from "./component/component-plugins.mjs";

export class RankiLang implements RankiLangInstance {
  private config: RankiLangConfig;
  public parsers: ParserPlugins;
  public components: ComponentPlugins;

  constructor(plugins: ParserPlugins, provided: RankiLanguageProvidedConfig[]) {
    this.parsers = plugins;
    this.config = new RankiLangConfig(plugins.produceConfig(), provided);
    this.components = new ComponentPlugins();
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
    return new RankiLang(this.parsers, this.config.clone(providedConfigs));
  }

  parse(
    raw: Record<string, string>,
    spec: RankiLangParseSpecs = {
      theater: "default",
      role: "default",
      // TODO these values only relevant to frames, maybe they should be in the frame specification
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

    if (spec["plugin"]) {
      const handler = this.parsers.getHandler(spec["plugin"].type);
      return handler(theaterRaw, spec, {
        lang: this,
        clone: this.clone.bind(this),
        parseAst: ast,
      });
    } else {
      const contentConfig = this.config.getAll().merged.content;
      const prefixLine =
        contentConfig.prefixLine !== "" ? contentConfig.prefixLine + "\n" : "";
      const suffixLine =
        contentConfig.suffixLine !== "" ? "\n" + contentConfig.suffixLine : "";

      const theaterWithContent = [
        prefixLine,
        contentConfig.prefix,
        theaterRaw,
        contentConfig.suffix,
        suffixLine,
      ].join("");
      const context: RankiLangAstContext = {
        lang: this,
        blockDepth: spec.blockDepth,
        inlineDepth: spec.inlineDepth,
        theater: spec.theater,
        role: spec.role,
        startRule: spec.startRule,
      };
      return {
        report,
        theaters: {
          [spec.theater]: {
            stages: {
              raw: theaterWithContent,
              ast: ast(context, theaterWithContent),
            },
          },
        },
      };
    }
  }
}

export interface ParseContext {
  config: RankiLanguageConfig;
  lang: RankiLang;
}
