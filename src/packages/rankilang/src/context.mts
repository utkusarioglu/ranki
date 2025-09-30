import type {
  RankiLanguageConfig,
  RankiLangInstance,
  RankiLanguageContextConfig,
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLangParseContext,
} from "@ranki/package-api";
import { parse } from "./parse.mjs";
import { ParserPlugins } from "./plugins.mjs";

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
    raw: Record<string, string>,
    spec: RankiLangParseSpecs = {
      frame: { type: "null" },
      theater: "default",
      role: "default",
      blockDepth: 0,
      inlineDepth: 0,
    },
  ): RankiLangParseResult {
    const theaterRaw = raw[spec.theater];

    if (theaterRaw === undefined) {
      throw new Error(`THEATER UNDEFINED: ${spec.theater}`);
    }

    const context: RankiLangParseContext = {
      lang: this,
      // totalDepth: spec.totalDepth,
      blockDepth: spec.blockDepth,
      inlineDepth: spec.inlineDepth,
      theater: spec.theater,
      role: spec.role,
    };

    switch (spec.frame.type) {
      case "null":
        const parsed = parse(context, theaterRaw);
        return {
          report: parsed.report,
          theaters: {
            [spec.theater]: {
              stages: {
                raw: theaterRaw,
                parse: {
                  root: parsed.parsed,
                },
              },
            },
          },
        };

      case "test":
        return {
          // @ts-expect-error
          report: {},
          theaters: {
            [spec.theater]: {
              stages: {
                raw: theaterRaw,
                parse: {
                  root: {
                    kind: "leaf",
                    type: spec.frame.type,
                    print: true,
                    args: {
                      depth: {
                        inline: 1,
                        block: 0,
                        total: 1,
                      },
                    },
                    source: {
                      type: "mixed",
                      value:
                        theaterRaw.trim() +
                        ": " +
                        spec.frame.params.join(" - "),
                    },
                  },
                },
              },
            },
          },
        };

      default:
        throw new Error(`UNRECOGNIZED FRAME TYPE: ${spec.frame.type}`);
    }
  }

  clone(
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
