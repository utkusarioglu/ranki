import type { ConfigEntryCode, IConfig } from "@dqm/package-dqm-api-v2";
import { DqmError } from "../error/error.mjs";
import type { LocalConfig, ConfigTypes, ObjectPath } from "./config.types.mjs";
import { assertNotExists, assertExists } from "../assertions.mjs";

export class Config implements IConfig {
  private configs: Record<ConfigEntryCode, LocalConfig> = {};
  private order: ConfigEntryCode[] = [];

  setOrder(order: ConfigEntryCode[]): IConfig {
    this.order = order;
    return this;
  }

  getOrder(): ConfigEntryCode[] {
    return this.order;
  }

  pushConfig(code: ConfigEntryCode, config: LocalConfig): IConfig {
    const c = this.configs[code];
    assertNotExists(c, { code, config, configs: this.configs });
    this.order.push(code);
    this.configs[code] = config;
    return this;
  }

  replaceConfig<C>(code: ConfigEntryCode, config: C): IConfig {
    const c = this.configs[code];
    assertExists(c, { config, code });
    this.configs[code] = config;
    return this;
  }

  dropConfig(code: ConfigEntryCode): IConfig {
    const c = this.configs[code];
    if (c === undefined) {
      return this;
    }
    delete this.configs[code];
    this.order = this.order.filter((v) => v === code);
    return this;
  }

  getConfig<T>(name: ConfigEntryCode): T {
    const c = this.configs[name];
    assertExists(c, { name, configs: this.configs });
    return c as unknown as T;
  }

  private determineType(curr: LocalConfig): ConfigTypes {
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
  private buildLevel(path: ObjectPath, objs: LocalConfig[]): LocalConfig {
    if (objs.length === 0) {
      throw new DqmError("ARRAY_EMPTY", {});
    }
    if (objs.length === 1) {
      return objs[0];
    }
    let base = objs[0];
    let baseType = this.determineType(base);
    for (let i = 1; i < objs.length; i++) {
      const curr = objs[i];
      const currType = this.determineType(curr);
      if (currType !== baseType) {
        const arrays =
          currType.startsWith("array") && baseType.startsWith("array");
        const kvs = currType.startsWith("kv") && baseType.startsWith("kv");
        const skip = currType === "undefined";
        const revert = currType === "null";

        if (!arrays && !kvs && !revert && !skip) {
          throw new DqmError("INCONSISTENT_CONFIG_TYPES", {
            objs,
            currType,
            baseType,
          });
        }
      }
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
          base = base.map((_: any, i: number) =>
            this.buildLevel(
              [path, i].join("."),
              objs.map((v) => v[i]),
            ),
          );
          break;
        case "kv-populated":
          base = Object.keys(base).reduce((a, k) => {
            // @ts-ignore
            a[k] = this.buildLevel(
              [path, k].join("."),
              objs.map((o) => o[k]),
            );
            return a;
          }, {});
          break;
        default:
          throw new DqmError("UNRESOLVED_TYPE", { curr, path });
      }
    }
    return base;
  }

  mergeTo(code: ConfigEntryCode): IConfig {
    const d = this.configs["default"];
    assertExists(d, { code, configs: this.configs });
    const nonDefaultOrdered = this.order
      .filter((v) => v !== "default")
      .reduce((a, c) => (a.push(c), a), [] as LocalConfig[]);
    const configs = ["default", ...nonDefaultOrdered].map(
      (n) => this.configs[n],
    );

    const merged = this.buildLevel("", configs);
    this.configs[code] = merged;
    return this;
  }

  clone() {
    const c = new Config();
    c.configs = { ...this.configs };
    c.order = [...this.order];
    return c;
  }
}
