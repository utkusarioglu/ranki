import type {
  AnkiMarked,
  AnkiNeutralTags,
  AnkiRawTag,
  FilteredTags,
  RankiTag,
  RankiTags,
  RawFields,
} from "_/collect/collect.types.mjs";

import { RankiAppError } from "_error/ranki-app-error.mjs";
import { Config } from "@dqm/package-dqm-config";
import yaml from "yaml";

import type {
  RankiChannelsConfig,
  RankiCollectedConfig,
  RankiConfigChannelsPartial,
  RankiTagPrefix,
} from "../config.types.mjs";

import { BaseConfig } from "./base/base.mjs";
import { RANKI_INITIAL_CONFIG } from "./initial-config/RANKI_INITIAL_CONFIG.mjs";

export class ConfigStream {
  public static collect(raw: null | RawFields): null | RankiCollectedConfig {
    return raw === null ? raw : this.collectConfig(raw);
  }

  private static collectConfig(raw: RawFields): RankiCollectedConfig {
    const channels = this.parseConfigs(raw);
    const tags = this.groupTags(raw, channels.base.tags.ranki.prefix);
    const base = new BaseConfig(channels, tags, raw).build();
    return { base, tags };
  }

  private static groupTags(
    raw: RawFields,
    rankiTagPrefix: RankiTagPrefix,
  ): FilteredTags {
    const tagsArr = raw.fields.tags
      .trim()
      .split(" ")
      .filter((v) => v.length);
    const ranki = [] as RankiTags;
    const neutral = [] as AnkiNeutralTags;
    let marked = false as AnkiMarked;
    tagsArr.forEach((t) => {
      if (t.startsWith(rankiTagPrefix)) {
        ranki.push(t as RankiTag);
      } else if (t === "marked") {
        marked = true as AnkiMarked;
      } else {
        neutral.push(t as AnkiRawTag);
      }
    });
    return { marked, neutral, ranki };
  }

  private static parseConfig(
    name: string,
    configStr: string,
  ): RankiConfigChannelsPartial {
    try {
      return yaml.parse(configStr);
    } catch (e) {
      throw new RankiAppError({
        cause: e,
        code: "CONFIG_PARSE_FAIL",
        details: { configStr, name },
        why: "Yaml parse operation of config failed",
      });
    }
  }

  private static parseConfigs(collected: RawFields): RankiChannelsConfig {
    const gConfig = new Config().pushConfig("default", RANKI_INITIAL_CONFIG);

    collected.config.forEach(({ config, name }) => {
      const parsed = this.parseConfig(name, config);
      if (parsed !== null) {
        gConfig.pushConfig(name, parsed);
      }
    });

    return gConfig.mergeTo("merged").getConfig<RankiChannelsConfig>("merged");
  }
}
