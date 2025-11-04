import type {
  RankiLanguageConfig,
  RankiLanguageDefaultConfig,
  RankiLanguageProvidedConfig,
  RankiLanguageMergedConfig,
  ProducedConfig,
} from "@ranki/package-api-v2";

export class RankiLangConfig {
  private defaultConfig: RankiLanguageDefaultConfig;
  private providedConfigs: RankiLanguageProvidedConfig[];
  private pluginsConfig: ProducedConfig;
  private config: RankiLanguageConfig;

  // TODO any
  constructor(
    pluginConfig: ProducedConfig,
    userConfigs: RankiLanguageProvidedConfig[],
  ) {
    this.pluginsConfig = pluginConfig;
    this.providedConfigs = userConfigs;
    this.defaultConfig = {
      stage: "transform",
      grammar: {
        tokens: this.pluginsConfig.tokens,
      },
      content: {
        prefix: "",
        suffix: "",
      },
      plugins: {
        standards: ["RankiConstantsV2", "RankiBaseV2"],
        requested: [],
        config: pluginConfig.config,
      },
    };

    this.config = {
      default: this.defaultConfig,
      provided: this.providedConfigs,
      merged: RankiLangConfig.merge([
        this.defaultConfig,
        ...this.providedConfigs,
      ]),
    };
  }

  getAll() {
    return this.config;
  }

  getMerged() {
    return this.config.merged;
  }

  getPluginConfig<T>(pluginName: string): T {
    const pluginsConfig = this.config.merged.plugins.config;

    // @ts-ignore
    if (!pluginsConfig[pluginName]) {
      throw new Error(`NO SUCH PLUGIN: ${pluginName}`);
    }
    // @ts-expect-error
    return pluginsConfig[pluginName] as T;
  }

  clone(newProvidedConfigs: RankiLanguageProvidedConfig[]) {
    // TODO can't decide whether provided configs should be merged with `this.providedConfigs`
    const providedConfigs = !!newProvidedConfigs.length
      ? newProvidedConfigs
      : this.providedConfigs;
    return new RankiLangConfig(this.pluginsConfig, providedConfigs);
  }

  // TODO any
  private static merge(configs: any[]): RankiLanguageMergedConfig {
    if (configs.length < 1) {
      throw new Error("NO CONFIG GIVEN");
    }
    if (configs.length === 1) {
      return configs[0];
    }
    const base = configs.shift();
    const rest = configs.filter((v) => !!v);

    rest.forEach((i) => {
      if (Array.isArray(i)) {
        throw new Error(`ARRAY WHEN OBJECT IS EXPECTED: ${JSON.stringify(i)}`);
      }
    });

    Object.entries(base).forEach(([k, _v]) => {
      const restDefined = rest.map((v) => v[k]).filter((v) => v !== undefined);

      if (typeof base[k] === "object" && !Array.isArray(base[k])) {
        RankiLangConfig.merge([base[k], ...restDefined]);
      } else if (Array.isArray(base[k])) {
        const s = new Set(base[k]);
        restDefined.forEach((a) => {
          if (!Array.isArray(a) && a !== null) {
            throw new Error(
              `THE FOLLOWING ASSIGNMENT WAS EXPECTED TO BE AN ARRAY: ${k}: ${a}`,
            );
          } else if (a === null) {
            s.clear();
          } else {
            // @ts-expect-error
            a.map((i) => s.add(i));
          }
        });
        base[k] = Array.from(s);
      } else if (restDefined.length) {
        let lastValid = restDefined[restDefined.length - 1];
        switch (typeof base[k]) {
          case "string":
            lastValid = lastValid.toString();
            break;
          case "number":
            lastValid = +lastValid;
            break;
          default:
            throw new Error(
              `IRRECONCILABLE TYPE CONVERSION. EXPECTED ${typeof base[
                k
              ]} BUT GOT ${lastValid} DURING MUTATION: ${
                base[k]
              } => ${lastValid}`,
            );
        }

        base[k] = lastValid;
      }
    });
    return base;
  }
}
