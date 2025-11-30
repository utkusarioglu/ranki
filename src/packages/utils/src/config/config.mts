import type { IConfig } from "@ranki/package-dqm-api-v2";
import { DqmError } from "../error/error.mjs";
import type { ConfigTypes } from "./config.types.mjs";

function assertExists<C extends {}>(value: C | undefined): asserts value is C {
  if (value === undefined) {
    throw new DqmError("VALUE_NOT_DEFINED", {});
  }
}

function assertNotExists<C extends {}>(
  value: C | undefined,
): asserts value is undefined {
  if (value !== undefined) {
    throw new DqmError("VALUE_DEFINED", {});
  }
}

export class Config<C extends {}> implements IConfig {
  private configs: Record<string, C> = {};
  private order: string[] = [];

  addConfig(code: string, config: C) {
    const c = this.configs[code];
    assertNotExists(c);
    this.order.push(code);
    this.configs[code] = config;
    return this;
  }

  replaceConfig(code: string, config: C) {
    const c = this.configs[code];
    assertExists(c);
    this.configs[code] = config;
    return this;
  }

  dropConfig(code: string) {
    const c = this.configs[code];
    if (c === undefined) {
      return this;
    }
    delete this.configs[code];
    this.order = this.order.filter((v) => v === code);
    return this;
  }

  getConfig<T>(code: string): T {
    const c = this.configs[code];
    assertExists<C>(c);
    return c as unknown as T;
  }

  private determineType(curr: any): ConfigTypes {
    const t = typeof curr;
    if (curr === undefined || ["bigint", "function", "symbol"].includes(t)) {
      return "undefined";
    } else if (curr === null) {
      return "null";
    } else if (["string", "number", "boolean"].includes(t)) {
      return t as ConfigTypes;
    } else {
      if (Array.isArray(curr)) {
        if (curr.length === 0) {
          return "array-empty";
        } else {
          return "array-populated";
        }
      } else if (t === "object") {
        if (Object.keys(t).length === 0) {
          return "kv-empty";
        } else {
          return "kv-populated";
        }
      }
    }
    throw new DqmError("UNRESOLVED_TYPE", { curr, t });
  }

  /**
   * @dev
   * if primitive, replace
   * if empty array, replace
   * if empty object, replace
   * if array, push
   * if object, merge
   * if null, set to default value (the first config in the array is the default)
   * if undefined, skip
   *
   * @param objs array of config objects to merge
   */
  private buildLevel(objs: any[]): any {
    if (objs.length === 0) {
      throw new DqmError("ARRAY_EMPTY", {});
    }
    let base = objs[0];
    for (let i = 1; i < objs.length; i++) {
      const curr = objs[i];
      switch (this.determineType(curr)) {
        case "string":
        case "number":
        case "boolean":
        case "array-empty":
        case "kv-empty":
          base = curr;
          break;
        case "undefined":
          break;
        case "null":
          base = objs[0];
          break;
        case "array-populated":
          base.push(...curr);
          break;
        case "kv-populated":
          base = { ...base, ...curr };
          break;
        default:
          throw new DqmError("UNRESOLVED_TYPE", { curr });
      }
    }
  }

  merge(): IConfig {
    const d = this.configs["default"];
    assertExists(d);
    const nonDefaultOrdered = this.order
      .filter((v) => v !== "default")
      .reduce((a, c) => (a.push(this.configs[c]), a), [] as C[]);

    const merged = this.buildLevel(["default", ...nonDefaultOrdered]);
    this.configs["merged"] = merged;
    return this;
  }

  // getMerged<T>() {
  //   const merged = this.configs["merged"];
  //   if (!merged) {
  //     throw new DqmError("CONFIG_NOT_MERGED", { obj: this });
  //   }
  //   return merged as unknown as T;
  // }

  clone() {
    const c = new Config();
    c.configs = { ...this.configs };
    c.order = [...this.order];
    return c;
  }

  // clone(newProvidedConfigs: RankiLanguageProvidedConfig[]) {
  //   // TODO can't decide whether provided configs should be merged with `this.providedConfigs`
  //   const providedConfigs = !!newProvidedConfigs.length
  //     ? newProvidedConfigs
  //     : this.providedConfigs;
  //   return new RankiLangConfig(this.pluginsConfig, providedConfigs);
  // }

  // // TODO any
  // private static merge(configs: any[]): RankiLanguageMergedConfig {
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
  //     const restDefined = rest.map((v) => v[k]).filter((v) => v !== undefined);

  //     if (typeof base[k] === "object" && !Array.isArray(base[k])) {
  //       RankiLangConfig.merge([base[k], ...restDefined]);
  //     } else if (Array.isArray(base[k])) {
  //       const s = new Set(base[k]);
  //       restDefined.forEach((a) => {
  //         if (!Array.isArray(a) && a !== null) {
  //           throw new Error(
  //             `THE FOLLOWING ASSIGNMENT WAS EXPECTED TO BE AN ARRAY: ${k}: ${a}`,
  //           );
  //         } else if (a === null) {
  //           s.clear();
  //         } else {
  //           // @ts-expect-error
  //           a.map((i) => s.add(i));
  //         }
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
}
