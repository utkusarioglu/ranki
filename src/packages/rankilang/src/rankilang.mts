import type {
  RankiLanguageConfig,
  RankiLangInstance,
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLangAstContext,
  RankiLanguageDefaultConfig,
  RankiLanguageUserConfig,
  RankiLangParseReport,
} from "@ranki/package-api";
import { ast } from "./ast.mjs";
import { ParserPlugins } from "./plugins.mjs";

function createMergedConfig(
  defaultConfig: RankiLanguageDefaultConfig,
  userConfig: RankiLanguageUserConfig,
): RankiLanguageConfig {
  const merged: RankiLanguageConfig["merged"] = {
    ...defaultConfig,
    ...userConfig,
    plugins: {
      standards: defaultConfig.plugins.standards,
      requested: userConfig.plugins.requested,
    },
  };

  return {
    default: defaultConfig,
    user: userConfig,
    merged,
  };
}

export class RankiLang implements RankiLangInstance {
  private defaultConfig: RankiLanguageDefaultConfig;
  private userConfig: RankiLanguageUserConfig;
  private config: RankiLanguageConfig;
  private plugins: ParserPlugins;

  constructor(
    plugins: ParserPlugins,
    defaultConfig: RankiLanguageDefaultConfig,
    userConfig: RankiLanguageUserConfig,
  ) {
    this.defaultConfig = defaultConfig;
    this.userConfig = userConfig;
    this.plugins = plugins;
    this.config = createMergedConfig(this.defaultConfig, this.userConfig);
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
      startRule: "root",
    };

    const report: RankiLangParseReport = {
      language: {
        versions: this.plugins.getVersions(),
      },
      config: this.config,
      theater: spec.theater,
      role: spec.role,
    };

    switch (spec.frame.type) {
      case "null":
        return {
          report,
          theaters: {
            [spec.theater]: {
              stages: {
                raw: theaterRaw,
                ast: ast(context, theaterRaw),
              },
            },
          },
        };

      case "test":
        console.log(spec);
        return {
          report,
          theaters: {
            [spec.theater]: {
              stages: {
                raw: theaterRaw,
                ast: {
                  report: {
                    parser: {
                      requested: [],
                      sorted: [],
                      graph: {},
                      contributors: {},
                      methods: {},
                    },
                  },
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
                        theaterRaw.trim() + ": " + spec.frame.params.length,
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

  clone(userConfig: RankiLanguageUserConfig | null): RankiLangInstance {
    const newUserConfig = userConfig === null ? this.userConfig : userConfig;
    return new RankiLang(this.plugins, this.defaultConfig, newUserConfig);
  }
}

export interface ParseContext {
  config: RankiLanguageConfig;
  lang: RankiLang;
}
