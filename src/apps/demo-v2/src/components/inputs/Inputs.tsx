import type { FC } from "react";
import { useEffect, useState } from "react";
import style from "./inputs.module.css";
import { createContext } from "@ranki/package-manager";
import yaml from "yaml";
import { ParserPlugins } from "@ranki/package-manager";
import { pluginObjects } from "../../plugins.mjs";
import type { RankiConfig } from "@ranki/package-api";
import type { PresetGroup } from "../app/App";

interface InputsProps {
  defaultConfigStr: string;
  setRankiParsed: (a: any) => void;
  presetGroups: PresetGroup[];
}
const allPlugins = pluginObjects.map((p) => p.name);

// const presets = [
//   {
//     name: "Hello World!",
//     value: "Hello World!",
//   },
//   {
//     name: "Ignore",
//     value: `% ignore\ncatdog`,
//   },
// ];

const parentProps = ["kind", "type", "args"];

const leafProps = ["kind", "type", "args", "children"];

export const Inputs: FC<InputsProps> = ({
  defaultConfigStr,
  setRankiParsed,
  presetGroups,
}) => {
  console.log(presetGroups);
  const [rankiConfigStr, setRankiConfigStr] = useState(defaultConfigStr);
  const [availablePlugins, setAvailablePlugins] = useState(allPlugins);
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>([]);
  const [rankiStr, setRankiStr] = useState(presetGroups[0].presets[0].value);

  useEffect(() => {
    try {
      const selectedPluginObjects = pluginObjects.filter((p) =>
        availablePlugins.includes(p.name),
      );
      const parserPlugins = new ParserPlugins();
      selectedPluginObjects.forEach((p) => parserPlugins.addPlugin(p));
      const rankiConfig: RankiConfig = yaml.parse(rankiConfigStr);
      rankiConfig.plugins.requested = selectedPlugins;
      const context = createContext(rankiConfig, parserPlugins);
      const parsed = context.methods.parser({ frameType: "null" })(
        context,
        rankiStr,
      );
      setRankiConfigStr(yaml.stringify(rankiConfig));
      setRankiParsed(parsed);
    } catch (e) {
      setRankiParsed({
        error: (e as Error).toString(),
      });
    }
  }, [rankiConfigStr, rankiStr, availablePlugins, selectedPlugins]);

  return (
    <div className={[style.inputs, style.roboto, style.scrollable].join(" ")}>
      <div className={style.titleContainer}>
        <h1>
          Ranki <span className={style.titleDim}>v2</span>
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
              Config
            </label>
          </summary>
          <textarea
            className={[style.inputField, style.scrollable].join(" ")}
            id="ranki"
            onChange={(e) => setRankiConfigStr(e.target.value)}
            value={rankiConfigStr}
          />
        </details>
      </fieldset>

      <fieldset className={style.inputFieldSet}>
        <details>
          <summary className={style.summary}>
            <label className={style.label} htmlFor="plugins">
              Available Plugins
            </label>
          </summary>
          {allPlugins.map((pn) => (
            <div key={pn}>
              <input
                id={["available", pn].join("-")}
                type="checkbox"
                checked={availablePlugins.includes(pn)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAvailablePlugins((l) => [
                      ...l.filter((n) => n !== pn),
                      pn,
                    ]);
                  } else {
                    setAvailablePlugins((l) => l.filter((n) => n !== pn));
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
              Selected Plugins
            </label>
          </summary>
          {allPlugins.map((pn) => (
            <div key={pn}>
              <input
                type="checkbox"
                checked={selectedPlugins.includes(pn)}
                id={["selected", pn].join("-")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPlugins((l) => [
                      ...l.filter((n) => n !== pn),
                      pn,
                    ]);
                  } else {
                    setSelectedPlugins((l) => l.filter((n) => n !== pn));
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
