import yaml from "yaml";
import type { RawFields } from "_config/collect/collect.types.mts";
import { RANKI_INITIAL_CONFIG } from "_config/config.constants.mts";
import type {
  RankiChannelsConfig,
  RankiConfigChannelsPartial,
} from "_config/config.types.mts";
import { Config } from "@dqm/package-dqm-utils";
// import { assertExists } from "@dqm/package-dqm-utils";
import { RankiAppError } from "_error/ranki-app-error.mts";

export function buildChannelsConfig(collected: RawFields): RankiChannelsConfig {
  const gConfig = new Config().pushConfig("default", RANKI_INITIAL_CONFIG);
  // const configOrder = [
  //   "user",
  //   // "template",
  //   "card",
  // ] as ConfigLocations[];

  collected.config.forEach(({ name, config }) => {
    const parsed = parseConfig(name, config);
    if (parsed !== null) {
      gConfig.pushConfig(name, parsed);
    }
  });

  // configOrder.forEach((loc) => {
  //   const c = collected.config[loc];
  //   assertExists(c, {
  //     why: "Required config location absent",
  //     details: { loc },
  //   });
  //   const parsed = parseConfig(loc, c);
  //   if (parsed !== null) {
  //     gConfig.pushConfig(loc, parsed);
  //   }
  // });

  return gConfig.mergeTo("merged").getConfig<RankiChannelsConfig>("merged");
}

export function parseConfig(
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
