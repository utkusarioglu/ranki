import type {
  RankiLanguageConfig,
  RankiLangInstance,
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLangAstContext,
  RankiLanguageDefaultConfig,
  RankiLanguageProvidedConfig,
  RankiLangParseReport,
} from "@ranki/package-api";
import { ast } from "./ast.mjs";
import { ParserPlugins } from "./plugins.mjs";
import { RankiLanguageMergedConfig } from "../../api/src/config.mjs";

// function createMergedConfig(
//   defaultConfig: RankiLanguageDefaultConfig,
//   userConfig: RankiLanguageUserConfig,
// ): RankiLanguageConfig {
//   const merged: RankiLanguageConfig["merged"] = {
//     ...defaultConfig,
//     ...userConfig,
//     plugins: {
//       standards: defaultConfig.plugins.standards,
//       requested: userConfig.plugins.requested,
//       config: {
//         ...defaultConfig.plugins.config,
//         ...userConfig.plugins.config,
//       },
//     },
//   };

//   return {
//     default: defaultConfig,
//     user: userConfig,
//     merged,
//   };
// }

function mergeConfigs(configs: any[]): RankiLanguageMergedConfig {
  if (configs.length < 1) {
    throw new Error("NO CONFIG GIVEN");
  }
  if (configs.length === 1) {
    return configs[0];
  }
  const rest = [...configs].filter((v) => !!v);
  const base = configs.shift();
  console.log("---", rest);

  Object.entries(base).forEach(([k, _v]) => {
    const restDefined = rest.map((v) => v[k]).filter((v) => !!v);

    if (typeof base[k] === "object" && !Array.isArray(base[k])) {
      mergeConfigs([base[k], ...restDefined]);
    } else if (Array.isArray(base[k])) {
      console.log("Arr");
      const s = new Set(base[k]);
      restDefined.forEach((a) => {
        a.map((i) => s.add(i));
      });
      base[k] = Array.from(s);
    } else if (restDefined.length) {
      base[k] = restDefined[restDefined.length - 1];
    }
  });
  return base;
}

export class RankiLang implements RankiLangInstance {
  private defaultConfig: RankiLanguageDefaultConfig;
  private providedConfigs: RankiLanguageProvidedConfig[];
  private config: RankiLanguageConfig;
  private plugins: ParserPlugins;

  constructor(
    plugins: ParserPlugins,
    // defaultConfig: RankiLanguageDefaultConfig,
    userConfigs: RankiLanguageProvidedConfig[],
  ) {
    // this.defaultConfig = defaultConfig;
    this.providedConfigs = userConfigs;
    this.plugins = plugins;
    this.defaultConfig = {
      tags: [],
      content: {
        prefix: "",
        prefixLine: "",
        suffix: "",
        suffixLine: "",
      },
      plugins: {
        standards: ["RankiConstantsV2", "RankiBaseV2"],
        requested: [],
        config: plugins.produceConfig(),
      },
    };

    // this.config = createMergedConfig(this.defaultConfig, this.userConfig);
    this.config = {
      default: this.defaultConfig,
      provided: this.providedConfigs,
      merged: mergeConfigs([this.defaultConfig, ...this.providedConfigs]),
    };
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

    const contentConfig = this.config.merged.content;
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

    switch (spec.frame.type) {
      case "null":
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

      case "test":
        console.log(spec);
        return {
          report,
          theaters: {
            [spec.theater]: {
              stages: {
                raw: theaterWithContent,
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
                        theaterWithContent.trim() +
                        ": " +
                        spec.frame.params.length,
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
    providedConfigs: RankiLanguageProvidedConfig[] | null,
  ): RankiLangInstance {
    const newProvidedConfigs =
      providedConfigs === null ? this.providedConfigs : providedConfigs;
    return new RankiLang(this.plugins, newProvidedConfigs);
  }
}

export interface ParseContext {
  config: RankiLanguageConfig;
  lang: RankiLang;
}
