import { useState, type FC } from "react";
import style from "./inputs.module.css";
import { pluginObjects, componentObjects } from "../../plugins.mjs";
import type { RankiLanguageDefaultConfig } from "@ranki/package-api-v2";
import type { PresetGroup } from "../../services/preset/preset.types";
import { useUserInput } from "../../hooks/user-input.hook.mts";
import { TabButton } from "../tab/TabButton";
import { TabButtonContainer } from "../tab/TabButtonContainer";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { SharedState } from "../app/shared-state.mts";

interface Tab {
  name: string;
  children: ReactNode;
}

interface InputsProps {
  initialLanguageUserConfigStr: string;
  languageDefaultConfig: RankiLanguageDefaultConfig;
  // setSharedState: (a: SharedState) => void;
  setSharedState: Dispatch<SetStateAction<SharedState>>;
  presetGroups: PresetGroup[];
}

// const parentProps = ["kind", "type", "shape"];

// const leafProps = ["kind", "type", "shape", "children"];

const AppTitle = () => (
  <div className={style.titleContainer}>
    <h3>
      RankiLang <span className={style.titleDim}>v2</span>
    </h3>
  </div>
);

export const Inputs: FC<InputsProps> = ({
  // languageDefaultConfig,
  setSharedState,
  presetGroups,
  initialLanguageUserConfigStr,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { rankiStr, theater, languageUserConfigStr, plugins, view } =
    useUserInput(
      // @ts-expect-error
      pluginObjects,
      componentObjects,
      setSharedState,
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
    {
      name: "View",
      children: "View",
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
            onChange={(e) => rankiStr.set(e.target.value)}
            value={rankiStr.value}
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
            value={theater.value}
            onChange={(e) => theater.set(e.target.value)}
          />
        </div>
        <textarea
          className={[style.input, style.textarea, style.scrollable].join(" ")}
          id="ranki"
          onChange={(e) => rankiStr.set(e.target.value)}
          value={rankiStr.value}
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
          onChange={(e) => languageUserConfigStr.set(e.target.value)}
          value={languageUserConfigStr.value}
        />
      </div>
    ),
    () => (
      <div className={style.tabPageContainer}>
        <div>
          <h2 className={style.h2}>Parser Plugins</h2>
          <fieldset className={style.inputFieldSet}>
            <legend className={style.label}>Installed</legend>
            {plugins.parser.all.map((pn) => (
              <div key={pn}>
                <input
                  id={["available", pn].join("-")}
                  type="checkbox"
                  // checked={installedParserPlugins.includes(pn)}
                  checked={plugins.parser.installed.value.includes(pn)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // setInstalledParserPlugins((l) => [
                      plugins.parser.installed.set((l) => [
                        ...l.filter((n) => n !== pn),
                        pn,
                      ]);
                    } else {
                      // setInstalledParserPlugins((l) =>
                      plugins.parser.installed.set((l) =>
                        l.filter((n) => n !== pn),
                      );
                    }
                  }}
                />
                <label
                  className={[style.inlineLabel, "monospace"].join(" ")}
                  htmlFor={["available", pn].join("-")}
                >
                  {pn.replace("Ranki", "")}
                </label>
              </div>
            ))}
            <div className={style.requestedPluginsButtonContainer}>
              <button
                className={style.buttonPlugins}
                // onClick={() => setInstalledParserPlugins(allParserPlugins)}
                onClick={() => plugins.parser.installed.set(plugins.parser.all)}
              >
                All
              </button>{" "}
              <button
                className={style.buttonPlugins}
                // onClick={() => setInstalledParserPlugins([])}
                onClick={() => plugins.parser.installed.set([])}
              >
                None
              </button>
            </div>
          </fieldset>

          <fieldset className={style.inputFieldSet}>
            <h4 className={style.label}>Requested</h4>
            {/* {allParserPlugins.map((pn) => ( */}
            {plugins.parser.all.map((pn) => (
              <div key={pn}>
                <input
                  type="checkbox"
                  // checked={requestedParserPlugins.includes(pn)}
                  checked={plugins.parser.requested.value.includes(pn)}
                  id={["selected", pn].join("-")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // setRequestedParserPlugins((l) => [
                      plugins.parser.requested.set((l) => [
                        ...l.filter((n) => n !== pn),
                        pn,
                      ]);
                    } else {
                      // setRequestedParserPlugins((l) =>
                      plugins.parser.requested.set((l) =>
                        l.filter((n) => n !== pn),
                      );
                    }
                  }}
                />
                <label
                  className={[style.inlineLabel, "monospace"].join(" ")}
                  htmlFor={["selected", pn].join("-")}
                >
                  {pn.replace("Ranki", "")}
                </label>
              </div>
            ))}
            <div className={style.requestedPluginsButtonContainer}>
              <button
                className={style.buttonPlugins}
                // onClick={() => setRequestedParserPlugins(allParserPlugins)}
                onClick={() => plugins.parser.requested.set(plugins.parser.all)}
              >
                All
              </button>{" "}
              <button
                className={style.buttonPlugins}
                // onClick={() => setRequestedParserPlugins([])}
                onClick={() => plugins.parser.requested.set([])}
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
            {plugins.component.all.map((pn) => (
              <div key={pn}>
                <input
                  id={["available", pn].join("-")}
                  type="checkbox"
                  checked={plugins.component.installed.value.includes(pn)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      plugins.component.installed.set((l) => [
                        ...l.filter((n) => n !== pn),
                        pn,
                      ]);
                    } else {
                      plugins.component.installed.set((l) =>
                        l.filter((n) => n !== pn),
                      );
                    }
                  }}
                />
                <label
                  className={[style.inlineLabel, "monospace"].join(" ")}
                  htmlFor={["available", pn].join("-")}
                >
                  {pn.replace("Ranki", "")}
                </label>
              </div>
            ))}
            <div className={style.requestedPluginsButtonContainer}>
              <button
                className={style.buttonPlugins}
                onClick={() =>
                  plugins.component.installed.set(plugins.component.all)
                }
              >
                All
              </button>{" "}
              <button
                className={style.buttonPlugins}
                onClick={() => plugins.component.installed.set([])}
              >
                None
              </button>
            </div>
          </fieldset>
        </div>
      </div>
    ),

    () => (
      <div className={style.tabPageContainer}>
        {[
          {
            title: "Ast Node",
            propName: "ast",
          },
          {
            title: "Validation Node",
            propName: "validation",
          },
          {
            title: "Transform Node",
            propName: "transform",
          },
        ].map(({ title, propName }) => {
          // @ts-expect-error
          const val = view[propName];
          return (
            <div>
              <h2 className={style.h2}>{title}</h2>
              <fieldset className={style.inputFieldSet}>
                {
                  // @ts-expect-error
                  val.all.map((pn) => (
                    <div key={pn}>
                      <input
                        id={["available", pn].join("-")}
                        type="checkbox"
                        checked={
                          // @ts-expect-error
                          view[propName].value.includes(pn)
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            // @ts-expect-error
                            val.set((l) => [
                              // @ts-expect-error
                              ...l.filter((n) => n !== pn),
                              pn,
                            ]);
                          } else {
                            // @ts-expect-error
                            val.set((l) => l.filter((n) => n !== pn));
                          }
                        }}
                      />
                      <label
                        className={[style.inlineLabel, "monospace"].join(" ")}
                        htmlFor={["available", pn].join("-")}
                      >
                        {pn}
                      </label>
                    </div>
                  ))
                }
                <div className={style.requestedPluginsButtonContainer}>
                  <button
                    className={style.buttonPlugins}
                    onClick={() => val.set(val.all)}
                  >
                    All
                  </button>{" "}
                  <button
                    className={style.buttonPlugins}
                    onClick={() => val.set([])}
                  >
                    None
                  </button>
                </div>
              </fieldset>
            </div>
          );
        })}
      </div>
    ),
  ];

  const TabPage = tabPages[tabIndex] ? (
    tabPages[tabIndex]()
  ) : (
    <h1>Component???</h1>
  );

  return (
    <div className={[style.inputs, "roboto", style.scrollableDark].join(" ")}>
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
