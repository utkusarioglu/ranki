import yaml from "yaml";
import { RANKI_INITIAL_CONFIG } from "_config/init/RANKI_INITIAL_CONFIG.mjs";
import type {
  RankiChannelsConfig,
  RankiConfigChannelsPartial,
} from "_config/config.types.mjs";
import { Config } from "@dqm/package-dqm-utils";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import type { RawFields } from "_collect/collect.types.mjs";

export function buildChannelsConfig(collected: RawFields): RankiChannelsConfig {
  const gConfig = new Config().pushConfig("default", RANKI_INITIAL_CONFIG);

  collected.config.forEach(({ name, config }) => {
    const parsed = parseConfig(name, config);
    if (parsed !== null) {
      gConfig.pushConfig(name, parsed);
    }
  });

  return gConfig.mergeTo("merged").getConfig<RankiChannelsConfig>("merged");
}

function parseConfig(
  name: string,
  configStr: string,
): RankiConfigChannelsPartial {
  try {
    return yaml.parse(configStr);
  } catch (e) {
    throw new RankiAppError({
      code: "CONFIG_PARSE_FAIL",
      why: "Yaml parse operation of config failed",
      cause: e,
      details: { name, configStr },
    });
  }
}
