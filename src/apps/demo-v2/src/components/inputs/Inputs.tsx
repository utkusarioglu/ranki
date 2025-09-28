import type { FC } from "react";
import { useEffect, useState } from "react";
import style from "./inputs.module.css";
import { createContext } from "@ranki/package-language";
import yaml from "yaml";
import { ParserPlugins } from "@ranki/package-language";
import { pluginObjects } from "../../plugins.mjs";
import type {
  // RankiLanguageContextConfig,
  RankiLanguageDefaultConfig,
  // RankiLanguageConfig,
  RankiLanguageUserConfig,
} from "@ranki/package-api";
import type { PresetGroup } from "../app/App";

// !FIX this needs to be in a separate package that deals with anki specific code
interface RankiAppUserConfig extends RankiLanguageUserConfig {
  version: "v2";
  anki: {
    deck: string;
    subdeck: string;
    tags: string;
    type: string;
    flag: string;
    card: string;
  };
}

// function createLanguageUserConfig(
//   a: RankiAppUserConfig,
// ): RankiLanguageUserConfig {
//   const user: RankiLanguageUserConfig = JSON.parse(JSON.stringify(a));
//   // @ts-expect-error
//   delete user.anki;
//   // @ts-expect-error
//   delete user.version;

//   user.tags = a.anki.tags.split(" ");

//   return user;
// }

// function createLanguageContextConfig(
//   d: RankiLanguageDefaultConfig,
//   c: RankiLanguageUserConfig,
// ): RankiLanguageContextConfig {
//   return {
//     default: d,
//     user: {
//       tags: c.anki.tags.split(" "),
//       plugins: c.plugins,
//       tokens: c.tokens,
//     },
//   };
// }

interface InputsProps {
  // defaultContextConfigStr: string;
  initialLanguageUserConfigStr: string;
  languageDefaultConfig: RankiLanguageDefaultConfig;
  setRankiParsed: (a: any) => void;
  presetGroups: PresetGroup[];
}
const allPlugins = pluginObjects.map((p) => p.name);

const parentProps = ["kind", "type", "args"];

const leafProps = ["kind", "type", "args", "children"];

export const Inputs: FC<InputsProps> = ({
  languageDefaultConfig,
  setRankiParsed,
  presetGroups,
  initialLanguageUserConfigStr,
}) => {
  const [languageUserConfigStr, setLanguageUserConfigStr] = useState<string>(
    initialLanguageUserConfigStr,
    // "{}",
    // defaultContextConfigStr,
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
      // const languageDefaultConfig: RankiLanguageDefaultConfig = yaml.parse(
      //   defaultContextConfigStr,
      // );
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
      setLanguageUserConfigStr(yaml.stringify(languageUserConfig));
      setRankiParsed(parsed);
    } catch (e) {
      setRankiParsed({
        error: (e as Error).toString(),
      });
    }
  }, [languageUserConfigStr, rankiStr, installedPlugins, requestedPlugins]);

  return (
    <div className={[style.inputs, style.roboto, style.scrollable].join(" ")}>
      <div className={style.titleContainer}>
        <h1>
          RankiLang<span className={style.titleDim}>v2</span>
        </h1>
      </div>
      <fieldset className={style.inputFieldSet}>
        <details open={true}>
          <summary className={style.summary}>
            <label className={style.label} htmlFor="ranki">
              Document
            </label>
          </summary>
          <select
            className={style.selectPreset}
            onChange={(e) => setRankiStr(e.target.value)}
          >
            {presetGroups.map(({ groupName, presets }) => (
              <optgroup key={groupName} label={groupName}>
                {presets.map(({ name, value }) => (
                  <option key={name} value={value}>
                    {name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <textarea
            className={[style.inputField, style.scrollable].join(" ")}
            id="ranki"
            onChange={(e) => setRankiStr(e.target.value)}
            value={rankiStr}
          />
        </details>
      </fieldset>

      <fieldset className={style.inputFieldSet}>
        <details>
          <summary className={style.summary}>
            <label className={style.label} htmlFor="ranki">
              User Config
            </label>
          </summary>
          <textarea
            className={[style.inputField, style.scrollable].join(" ")}
            id="ranki"
            onChange={(e) => setLanguageUserConfigStr(e.target.value)}
            value={languageUserConfigStr}
          />
        </details>
      </fieldset>

      <fieldset className={style.inputFieldSet}>
        <details>
          <summary className={style.summary}>
            <label className={style.label} htmlFor="plugins">
              Installed Plugins
            </label>
          </summary>
          {allPlugins.map((pn) => (
            <div key={pn}>
              <input
                id={["available", pn].join("-")}
                type="checkbox"
                checked={installedPlugins.includes(pn)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setInstalledPlugins((l) => [
                      ...l.filter((n) => n !== pn),
                      pn,
                    ]);
                  } else {
                    setInstalledPlugins((l) => l.filter((n) => n !== pn));
                  }
                }}
              />
              <label
                className={style.inlineLabel}
                htmlFor={["available", pn].join("-")}
              >
                {pn.replace("Ranki", "")}
              </label>
            </div>
          ))}
        </details>
      </fieldset>

      <fieldset className={style.inputFieldSet}>
        <details>
          <summary className={style.summary}>
            <label className={style.label} htmlFor="plugins">
              Requested Plugins
            </label>
          </summary>
          {allPlugins.map((pn) => (
            <div key={pn}>
              <input
                type="checkbox"
                checked={requestedPlugins.includes(pn)}
                id={["selected", pn].join("-")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setRequestedPlugins((l) => [
                      ...l.filter((n) => n !== pn),
                      pn,
                    ]);
                  } else {
                    setRequestedPlugins((l) => l.filter((n) => n !== pn));
                  }
                }}
              />
              <label
                className={style.inlineLabel}
                htmlFor={["selected", pn].join("-")}
              >
                {pn.replace("Ranki", "")}
              </label>
            </div>
          ))}
        </details>
      </fieldset>
    </div>
  );
};
