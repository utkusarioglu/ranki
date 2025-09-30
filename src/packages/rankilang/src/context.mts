import type {
  RankiLanguageConfig,
  RankiLangInstance,
  RankiLanguageContextConfig,
  RankiLangParseResult,
  RankiLangParseSpecs,
} from "@ranki/package-api";
import { parse } from "./parse.mjs";
import { ParserPlugins } from "./plugins.mjs";
import { RankiLanguageMergedConfig } from "../../api/src/config.mjs";

function createMergedConfig(
  contextConfig: RankiLanguageContextConfig,
): RankiLanguageConfig {
  const merged: RankiLanguageConfig["merged"] = {
    ...contextConfig.default,
    ...contextConfig.user,
    plugins: {
      standards: contextConfig.default.plugins.standards,
      requested: contextConfig.user.plugins.requested,
    },
  };

  return {
    default: contextConfig.default,
    user: contextConfig.user,
    merged,
  };
}

export class RankiLang implements RankiLangInstance {
  private contextConfig: RankiLanguageContextConfig;
  private config: RankiLanguageConfig;
  private plugins: ParserPlugins;

  constructor(
    contextConfig: RankiLanguageContextConfig,
    plugins: ParserPlugins,
  ) {
    this.contextConfig = contextConfig;
    this.plugins = plugins;
    this.config = createMergedConfig(this.contextConfig);
  }

  getConfig() {
    return this.config;
  }

  getPlugins() {
    return this.plugins;
  }

  parse(
    raw: string,
    s: RankiLangParseSpecs = { frame: { type: "null" } },
  ): RankiLangParseResult {
    switch (s.frame.type) {
      case "null":
        return parse(this, raw);

      case "test":
        return {
          stages: {
            // @ts-expect-error
            parse: {
              root: {
                kind: "leaf",
                type: s.frame.type,
                print: true,
                args: {},
                source: {
                  type: "mixed",
                  value: raw.trim() + ": " + s.frame.params.join(" - "),
                },
              },
            },
          },
        };

      default:
        return parse(this, raw);
    }
  }

  create(
    contextConfig: RankiLanguageContextConfig,
    plugins: ParserPlugins,
  ): RankiLangInstance {
    const newContextConfig =
      contextConfig === null ? this.contextConfig : contextConfig;
    const newPlugins = plugins === null ? this.plugins : plugins;
    const lang = new RankiLang(newContextConfig, newPlugins);
    return lang;
  }
}

export interface ParseContext {
  config: RankiLanguageConfig;
  lang: RankiLang;
}
