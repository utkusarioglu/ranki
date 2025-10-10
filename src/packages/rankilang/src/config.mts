import type {
  RankiLanguageConfig,
  RankiLanguageDefaultConfig,
  RankiLanguageProvidedConfig,
} from "@ranki/package-api";
import { RankiLanguageMergedConfig } from "../../api/src/config.mjs";

// function mergeConfigs(configs: any[]): RankiLanguageMergedConfig {
//   if (configs.length < 1) {
//     throw new Error("NO CONFIG GIVEN");
//   }
//   if (configs.length === 1) {
//     return configs[0];
//   }
//   const base = configs.shift();
//   const rest = configs.filter((v) => !!v);

//   rest.forEach((i) => {
//     if (Array.isArray(i)) {
//       throw new Error(`ARRAY WHEN OBJECT IS EXPECTED: ${JSON.stringify(i)}`);
//     }
//   });

//   Object.entries(base).forEach(([k, _v]) => {
//     const restDefined = rest.map((v) => v[k]).filter((v) => !!v);

//     if (typeof base[k] === "object" && !Array.isArray(base[k])) {
//       mergeConfigs([base[k], ...restDefined]);
//     } else if (Array.isArray(base[k])) {
//       const s = new Set(base[k]);
//       restDefined.forEach((a) => {
//         if (!Array.isArray(a)) {
//           throw new Error(
//             `THE FOLLOWING ASSIGNMENT WAS EXPECTED TO BE AN ARRAY: ${k}: ${a}`,
//           );
//         }
//         a.map((i) => s.add(i));
//       });
//       base[k] = Array.from(s);
//     } else if (restDefined.length) {
//       let lastValid = restDefined[restDefined.length - 1];
//       switch (typeof base[k]) {
//         case "string":
//           lastValid = lastValid.toString();
//           break;
//         case "number":
//           lastValid = +lastValid;
//           break;
//         default:
//           throw new Error(
//             `IRRECONCILABLE TYPE CONVERSION. EXPECTED ${typeof base[
//               k
//             ]} BUT GOT ${lastValid} DURING MUTATION: ${
//               base[k]
//             } => ${lastValid}`,
//           );
//       }

//       base[k] = lastValid;
//     }
//   });
//   return base;
// }

export class RankiLangConfig {
  private defaultConfig: RankiLanguageDefaultConfig;
  private providedConfigs: RankiLanguageProvidedConfig[];
  private config: RankiLanguageConfig;

  // TODO any
  constructor(pluginConfig: any, userConfigs: RankiLanguageProvidedConfig[]) {
    this.providedConfigs = userConfigs;
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
        config: pluginConfig,
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

  clone(providedConfigs: RankiLanguageProvidedConfig[] | null) {
    const newProvidedConfigs =
      providedConfigs === null ? this.providedConfigs : providedConfigs;
    return newProvidedConfigs;
  }

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
      const restDefined = rest.map((v) => v[k]).filter((v) => !!v);

      if (typeof base[k] === "object" && !Array.isArray(base[k])) {
        RankiLangConfig.merge([base[k], ...restDefined]);
      } else if (Array.isArray(base[k])) {
        const s = new Set(base[k]);
        restDefined.forEach((a) => {
          if (!Array.isArray(a)) {
            throw new Error(
              `THE FOLLOWING ASSIGNMENT WAS EXPECTED TO BE AN ARRAY: ${k}: ${a}`,
            );
          }
          a.map((i) => s.add(i));
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
