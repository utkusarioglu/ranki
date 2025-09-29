import { useState, type FC } from "react";
import style from "./inputs.module.css";
import { pluginObjects } from "../../plugins.mjs";
import type { RankiLanguageDefaultConfig } from "@ranki/package-api";
import type { PresetGroup } from "../../services/preset/preset.types";
import { useUserInput } from "../../hooks/user-input.hook.mts";
import { TabButton } from "../tab/TabButton";
import { TabButtonContainer } from "../tab/TabButtonContainer";
import type { ReactNode } from "react";

interface Tab {
  name: string;
  children: ReactNode;
}

interface InputsProps {
  initialLanguageUserConfigStr: string;
  languageDefaultConfig: RankiLanguageDefaultConfig;
  setRankiParsed: (a: any) => void;
  presetGroups: PresetGroup[];
}

const parentProps = ["kind", "type", "args"];

const leafProps = ["kind", "type", "args", "children"];

const AppTitle = () => (
  <div className={style.titleContainer}>
    <h3>
      RankiLang <span className={style.titleDim}>v2</span>
    </h3>
  </div>
);

export const Inputs: FC<InputsProps> = ({
  languageDefaultConfig,
  setRankiParsed,
  presetGroups,
  initialLanguageUserConfigStr,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const {
    setRankiStr,
    setInstalledPlugins,
    setRequestedPlugins,
    installedPlugins,
    rankiStr,
    languageUserConfigStr,
    setLanguageUserConfigStr,
    requestedPlugins,
    allPlugins,
  } = useUserInput(
    pluginObjects,
    setRankiParsed,
    languageDefaultConfig,
    initialLanguageUserConfigStr,
    presetGroups,
  );

  const tabButtons: Tab[] = [
    {
      name: "Document",
      children: <AppTitle />,
    },
    {
      name: "Config",
      children: "Config",
    },
    {
      name: "Plugins",
      children: "Plugins",
    },
  ];

  const tabPages = [
    () => (
      <div
        className={[style.tabPageContainer, style.tabBlockPadding].join(" ")}
      >
        <select
          className={style.selectPreset}
          onChange={(e) => setRankiStr(e.target.value)}
          value={rankiStr}
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
      </div>
    ),
    () => (
      <div
        className={[style.tabPageContainer, style.tabBlockPadding].join(" ")}
      >
        <textarea
          className={[style.inputField, style.scrollable].join(" ")}
          id="ranki"
          onChange={(e) => setLanguageUserConfigStr(e.target.value)}
          value={languageUserConfigStr}
        />
      </div>
    ),
    () => (
      <div className={style.tabPageContainer}>
        <fieldset className={style.inputFieldSet}>
          <legend className={style.label}>Installed Plugins</legend>
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
        </fieldset>

        <fieldset className={style.inputFieldSet}>
          <h4 className={style.label}>Requested Plugins</h4>
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
        </fieldset>
      </div>
    ),
  ];

  const TabPage = tabPages[tabIndex] ? (
    tabPages[tabIndex]()
  ) : (
    <h1>Component???</h1>
  );

  return (
    <div
      className={[style.inputs, style.roboto, style.scrollableDark].join(" ")}
    >
      <TabButtonContainer>
        {tabButtons.map(({ name, children }, i) => (
          <TabButton
            key={name}
            isActive={i === tabIndex}
            onClick={() => {
              setTabIndex(i);
            }}
          >
            {children}
          </TabButton>
        ))}
      </TabButtonContainer>

      {TabPage}
    </div>
  );
};
