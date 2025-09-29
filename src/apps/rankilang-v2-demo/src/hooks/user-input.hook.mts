import { useEffect, useState } from "react";
import { createContext } from "@ranki/package-rankilang";
import yaml from "yaml";
import { ParserPlugins } from "@ranki/package-rankilang";
import type { PresetGroup } from "../services/preset/preset.types";
import type {
  RankiLanguageDefaultConfig,
  RankiLanguageUserConfig,
  RankiPluginParser,
} from "@ranki/package-api";

/**
 * This is a hideous thing and direly needs tidying up.
 * Though, it works just fine...
 */
export function useUserInput(
  pluginObjects: RankiPluginParser[],
  setRankiParsed: (a: any) => void,
  languageDefaultConfig: RankiLanguageDefaultConfig,
  initialLanguageUserConfigStr: string,
  presetGroups: PresetGroup[],
) {
  const allPlugins = pluginObjects.map((p) => p.name);
  const [languageUserConfigStr, setLanguageUserConfigStr] = useState<string>(
    initialLanguageUserConfigStr,
  );
  const [installedPlugins, setInstalledPlugins] = useState(allPlugins);
  const [requestedPlugins, setRequestedPlugins] = useState<string[]>([]);
  const [rankiStr, setRankiStr] = useState(presetGroups[0].presets[0].value);

  useEffect(() => {
    try {
      const selectedPluginObjects = pluginObjects.filter((p) =>
        installedPlugins.includes(p.name),
      );
      const parserPlugins = new ParserPlugins();
      selectedPluginObjects.forEach((p) => parserPlugins.addPlugin(p));
      const languageUserConfig: RankiLanguageUserConfig = yaml.parse(
        languageUserConfigStr,
      );
      languageUserConfig.plugins.requested = requestedPlugins;
      const context = createContext(
        {
          default: languageDefaultConfig,
          user: languageUserConfig,
        },
        parserPlugins,
      );
      const parsed = context.methods.parser({ frameType: "null" })(
        context,
        rankiStr,
      );
      setRankiParsed(parsed);
    } catch (e) {
      setRankiParsed({
        error: (e as Error).toString(),
      });
    }
  }, [languageUserConfigStr, rankiStr, installedPlugins, requestedPlugins]);

  return {
    setRankiStr,
    setInstalledPlugins,
    setRequestedPlugins,
    installedPlugins,
    rankiStr,
    languageUserConfigStr,
    setLanguageUserConfigStr,
    requestedPlugins,
    allPlugins,
  };
}
