import { useState, type FC } from "react";
import style from "./inputs.module.css";
import { pluginObjects, componentObjects } from "../../plugins.mjs";
import type { RankiLanguageDefaultConfig } from "@ranki/package-api-v2";
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

// const parentProps = ["kind", "type", "args"];

// const leafProps = ["kind", "type", "args", "children"];

const AppTitle = () => (
  <div className={style.titleContainer}>
    <h3>
      RankiLang <span className={style.titleDim}>v2</span>
    </h3>
  </div>
);

export const Inputs: FC<InputsProps> = ({
  // languageDefaultConfig,
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
    theater,
    setTheater,
  } = useUserInput(
    // @ts-expect-error
    pluginObjects,
    componentObjects,
    setRankiParsed,
    // languageDefaultConfig,
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
        <div className={style.labelAndInput}>
          <label htmlFor="preset">Preset</label>
          <select
            id="preset"
            className={[
              style.input,
              style.inlineInput,
              style.selectPreset,
            ].join(" ")}
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
        </div>
        <div className={style.labelAndInput}>
          <label htmlFor="theater">Theater</label>
          <input
            id="theater"
            className={[style.input, style.inlineInput].join(" ")}
            type="text"
            value={theater}
            onChange={(e) => setTheater(e.target.value)}
          />
        </div>
        <textarea
          className={[style.input, style.textarea, style.scrollable].join(" ")}
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
          className={[style.input, style.textarea, style.scrollable].join(" ")}
          id="ranki"
          onChange={(e) => setLanguageUserConfigStr(e.target.value)}
          value={languageUserConfigStr}
        />
      </div>
    ),
    () => (
      <div className={style.tabPageContainer}>
        <div>
          <h2 className={style.h2}>Parser Plugins</h2>
          <fieldset className={style.inputFieldSet}>
            <legend className={style.label}>Installed</legend>
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
            <div className={style.requestedPluginsButtonContainer}>
              <button
                className={style.buttonPlugins}
                onClick={() => setInstalledPlugins(allPlugins)}
              >
                All
              </button>{" "}
              <button
                className={style.buttonPlugins}
                onClick={() => setInstalledPlugins([])}
              >
                None
              </button>
            </div>
          </fieldset>

          <fieldset className={style.inputFieldSet}>
            <h4 className={style.label}>Requested</h4>
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
            <div className={style.requestedPluginsButtonContainer}>
              <button
                className={style.buttonPlugins}
                onClick={() => setRequestedPlugins(allPlugins)}
              >
                All
              </button>{" "}
              <button
                className={style.buttonPlugins}
                onClick={() => setRequestedPlugins([])}
              >
                None
              </button>
            </div>
          </fieldset>
        </div>

        <div>
          <h2 className={style.h2}>Component Plugins</h2>
          <fieldset className={style.inputFieldSet}>
            <legend className={style.label}>Installed</legend>
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
            <div className={style.requestedPluginsButtonContainer}>
              <button
                className={style.buttonPlugins}
                onClick={() => setInstalledPlugins(allPlugins)}
              >
                All
              </button>{" "}
              <button
                className={style.buttonPlugins}
                onClick={() => setInstalledPlugins([])}
              >
                None
              </button>
            </div>
          </fieldset>

          <fieldset className={style.inputFieldSet}>
            <h4 className={style.label}>Requested</h4>
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
            <div className={style.requestedPluginsButtonContainer}>
              <button
                className={style.buttonPlugins}
                onClick={() => setRequestedPlugins(allPlugins)}
              >
                All
              </button>{" "}
              <button
                className={style.buttonPlugins}
                onClick={() => setRequestedPlugins([])}
              >
                None
              </button>
            </div>
          </fieldset>
        </div>
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
