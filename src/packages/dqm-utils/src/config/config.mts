import { DqmConfigError } from "./error/error.mjs";
import type { LocalConfig, ObjectPath } from "./config.types.mjs";
import {
  assertNotExists,
  assertExists,
  assertArrayNotEmpty,
  assertNotIllegal,
} from "./error/assertions.mjs";
import type {
  ConfigEntryCode,
  ConfigName,
  IConfig,
} from "@dqm/package-dqm-api-v2";
import { TypeEngine } from "./type-engine.mjs";

export class Config implements IConfig {
  private configs: Record<ConfigEntryCode, LocalConfig> = {};
  private order: ConfigEntryCode[] = [];
  private parent: IConfig | null = null;
  private name: ConfigName = "(unnamed)";

  setOrder(order: ConfigEntryCode[]): this {
    this.order = order;
    return this;
  }

  getOrder(): ConfigEntryCode[] {
    return this.order;
  }

  pushConfig(code: ConfigEntryCode, config: LocalConfig): this {
    const c = this.configs[code];
    assertNotExists(c, {
      why: "Config entry codes cannot be overwritten",
      details: {
        code,
        config,
        configs: this.configs,
      },
    });
    this.order.push(code);
    this.configs[code] = config;
    return this;
  }

  pushProperty(path: string, value: any): this {
    const c: any = {};
    let curr = c;
    const chain: string[] = path.split(".");
    chain.forEach((part, i, all) => {
      if (i < all.length - 1) {
        if (!curr[part]) {
          curr[part] = {};
        }
        curr = curr[part];
      } else {
        // const values = value;
        // curr[part] = values.length === 1 ? values[0] : values;
        curr[part] = value;
      }
      //   c[part] =
    });
    this.pushConfig(path, c);
    return this;
  }

  replaceConfig<C>(code: ConfigEntryCode, config: C): this {
    const c = this.configs[code];
    assertExists(c, {
      why: "Cannot replace a config that has no entry.",
      details: { config, code },
    });
    this.configs[code] = config;
    return this;
  }

  dropConfig(code: ConfigEntryCode): this {
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
    assertExists(c, {
      why: "Config entry codes need to correspond to a valid config",
      details: {
        name,
        configs: this.configs,
      },
    });
    return c as unknown as T;
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
    assertArrayNotEmpty(objs, {
      why: "Cannot build a level with no members",
      details: {
        path,
      },
    });
    if (objs.length === 1) {
      return objs[0];
    }
    let base = objs[0];
    let baseType = TypeEngine.determineType(base);
    assertNotIllegal(baseType, {});
    for (let i = 1; i < objs.length; i++) {
      const curr = objs[i];
      const currType = TypeEngine.determineType(curr);
      assertNotIllegal(currType, {});
      if (!TypeEngine.determineConsistency(base, baseType, curr, currType)) {
        throw new DqmConfigError({
          code: "INCONSISTENT_CONFIG_TYPES",
          why: "Given value is not in the permitted list of type coercions",
          cause: null,
          details: {
            objs,
            curr,
            base,
            currType,
            baseType,
          },
        });
      }
      switch (currType) {
        case "bigint":
        case "string":
        case "number":
        case "boolean":
        case "array-empty":
        case "kv-empty":
        case "tuple":
          base = curr;
          break;
        case "undefined":
          break;
        case "null":
          base = objs[0];
          break;
        case "array-populated":
          base = [
            ...base,
            // !FIX I think this is wrong. array children aren't merged and maybe they should be
            ...curr,
          ];
          break;
        case "kv-populated":
          base = Object.keys(base).reduce((a, k) => {
            // @ts-ignore
            a[k] = this.buildLevel(
              [path, k].join("."),
              objs.map((o) => o[k]).filter((v) => v !== undefined),
            );
            return a;
          }, {});
          break;
      }
    }
    return base;
  }

  mergeTo(code: ConfigEntryCode): this {
    const d = this.configs["default"];
    assertExists(d, {
      why: "The default configuration is the basis for the rest and has to be defined",
      details: { code, configs: this.configs },
    });
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

  clone(name: ConfigName): IConfig {
    const c = new Config();
    c.configs = { ...this.configs };
    c.order = [...this.order];
    c.parent = this;
    c.name = name;
    return c;
  }

  getParent(): IConfig | null {
    return this.parent;
  }

  getName(): ConfigName {
    return this.name;
  }
}
