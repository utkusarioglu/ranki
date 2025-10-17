import { useEffect, useState } from "react";
import yaml from "yaml";
import {
  // ParserPlugins,
  RankiLang,
} from "@ranki/package-rankilang-v2";
import type { PresetGroup } from "../services/preset/preset.types";
import type {
  // RankiLanguageDefaultConfig,
  RankiLanguageProvidedConfig,
  RankiPluginComponent,
  RankiPluginParser,
} from "@ranki/package-api-v2";

/**
 * This is a hideous thing and direly needs tidying up.
 * Though, it works just fine...
 */
export function useUserInput(
  parserPluginObjects: RankiPluginParser[],
  componentPluginObjects: RankiPluginComponent[],
  setSharedState: (a: any) => void,
  // languageDefaultConfig: RankiLanguageDefaultConfig,
  initialLanguageUserConfigStr: string,
  presetGroups: PresetGroup[],
) {
  const allParserPlugins = parserPluginObjects.map((p) => p.meta.name);
  const allComponentPlugins = componentPluginObjects.map((p) => p.meta.name);
  const [languageUserConfigStr, setLanguageUserConfigStr] = useState<string>(
    initialLanguageUserConfigStr,
  );
  const [theater, setTheater] = useState<string>("default");
  const [installedParserPlugins, setInstalledParserPlugins] =
    useState(allParserPlugins);
  const [requestedParserPlugins, setRequestedParserPlugins] = useState<
    string[]
  >([]);
  const [installedComponentPlugins, setInstalledComponentPlugins] =
    useState(allComponentPlugins);
  // const [requestedComponentPlugins, setRequestedComponentPlugins] = useState<
  //   string[]
  // >([]);
  const [rankiStr, setRankiStr] = useState(presetGroups[0].presets[0].value);

  useEffect(() => {
    try {
      const selectedParserPluginObjects = parserPluginObjects.filter((p) =>
        installedParserPlugins.includes(p.meta.name),
      );
      const selectedComponentPluginObjects = componentPluginObjects.filter(
        (p) => installedComponentPlugins.includes(p.meta.name),
      );
      // const parserPlugins = new ParserPlugins();
      // selectedPluginObjects.forEach((p) => parserPlugins.addPlugin(p));
      const languageUserConfig: RankiLanguageProvidedConfig = yaml.parse(
        languageUserConfigStr,
      );
      const rankiLang = new RankiLang(
        {
          parsers: selectedParserPluginObjects,
          components: selectedComponentPluginObjects,
        },
        [
          {
            plugins: {
              requested: requestedParserPlugins,
            },
          } as RankiLanguageProvidedConfig,
          languageUserConfig,
        ],
      );
      const parsed = rankiLang.parse({ [theater]: rankiStr });
      const config = rankiLang.getConfig().merged;
      setSharedState({ type: "loaded", parsed, config });
    } catch (e) {
      setSharedState({
        type: "error",
        error: (e as Error).toString(),
      });
    }
  }, [
    languageUserConfigStr,
    rankiStr,
    installedParserPlugins,
    requestedParserPlugins,
    theater,
    installedComponentPlugins,
  ]);

  return {
    rankiStr: {
      set: setRankiStr,
      value: rankiStr,
    },
    theater: {
      value: theater,
      set: setTheater,
    },

    languageUserConfigStr: {
      value: languageUserConfigStr,
      set: setLanguageUserConfigStr,
    },

    plugins: {
      parser: {
        installed: {
          value: installedParserPlugins,
          set: setInstalledParserPlugins,
        },
        requested: {
          value: requestedParserPlugins,
          set: setRequestedParserPlugins,
        },
        all: allParserPlugins,
      },
      component: {
        installed: {
          value: installedComponentPlugins,
          set: setInstalledComponentPlugins,
        },
        // requested: {
        //   value: requestedComponentPlugins,
        //   set: setRequestedComponentPlugins,
        // },
        all: allComponentPlugins,
      },
    },
  };
}
