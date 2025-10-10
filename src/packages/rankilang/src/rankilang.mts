import type {
  RankiLanguageConfig,
  RankiLangInstance,
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLangAstContext,
  RankiLanguageProvidedConfig,
  RankiLangParseReport,
} from "@ranki/package-api";
import { ast } from "./ast.mjs";
import { ParserPlugins } from "./plugins.mjs";
import { RankiLangConfig } from "./config.mjs";

export class RankiLang implements RankiLangInstance {
  private config: RankiLangConfig;
  private plugins: ParserPlugins;

  constructor(plugins: ParserPlugins, provided: RankiLanguageProvidedConfig[]) {
    this.plugins = plugins;
    this.config = new RankiLangConfig(plugins.produceConfig(), provided);
  }

  getConfig() {
    return this.config.getAll();
  }

  getPlugins() {
    return this.plugins;
  }

  clone(
    providedConfigs: RankiLanguageProvidedConfig[] | null,
  ): RankiLangInstance {
    return new RankiLang(this.plugins, this.config.clone(providedConfigs));
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

    const context: RankiLangAstContext = {
      lang: this,
      blockDepth: spec.blockDepth,
      inlineDepth: spec.inlineDepth,
      theater: spec.theater,
      role: spec.role,
      startRule: spec.startRule,
    };

    const report: RankiLangParseReport = {
      language: {
        versions: this.plugins.getVersions(),
      },
      config: this.config.getAll(),
      theater: spec.theater,
      role: spec.role,
    };

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

    if (!spec.frame) {
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

    switch (spec.frame.version) {
      case "v1":
        console.log("v1!");
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

      case "v2":
        console.log("v2!");
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
