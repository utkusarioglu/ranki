import type { FC } from "react";
import { useEffect, useState } from "react";
import appStyle from "./app.module.css";
import { Inputs } from "../inputs/Inputs";

import yaml from "yaml";
import { Output } from "../output/Output";
import type { RankiLanguageDefaultConfig } from "@ranki/package-api";

interface RankiV2DemoProps {
  languageDefaultConfig: RankiLanguageDefaultConfig;
  initialLanguageUserConfigStr: string;
  presetGroups: PresetGroup[];
}

export interface PresetGroup {
  groupName: string;
  presets: Preset[];
}

interface Preset {
  name: string;
  value: string;
}

const RankiV2Demo: FC<RankiV2DemoProps> = ({
  languageDefaultConfig,
  presetGroups,
  initialLanguageUserConfigStr,
}) => {
  const [parsed, setRankiParsed] = useState<object | null>(null);

  return (
    <div className={[appStyle.layout].join(" ")}>
      <Inputs
        setRankiParsed={setRankiParsed}
        languageDefaultConfig={languageDefaultConfig}
        presetGroups={presetGroups}
        initialLanguageUserConfigStr={initialLanguageUserConfigStr}
      />
      <Output parsed={parsed} />
    </div>
  );
};

const presetFiles = [
  {
    basename: "base-v2",
    groupName: "Base v2",
  },
  {
    basename: "rich-number-v2",
    groupName: "Rich Number v2",
  },
  {
    basename: "rich-structure-v2",
    groupName: "Rich Structure v2",
  },
  {
    basename: "rich-text-v2",
    groupName: "Rich Text v2",
  },
  {
    basename: "frame-v2",
    groupName: "Frame v2",
  },
  {
    basename: "frame-v1",
    groupName: "Frame v1",
  },
];

function App() {
  const [languageDefaultConfigStr, setLanguageDefaultConfigStr] = useState<
    string | null
  >(null);
  const [presetGroups, setPresetGroups] = useState<PresetGroup[] | null>(null);

  useEffect(() => {
    Promise.all([
      Promise.all(
        presetFiles.map(({ basename, groupName }) =>
          fetch(`/presets/${basename}.ranki-demo`)
            .then((r) => r.text())
            .then((t) => {
              const presets = t
                .split("---")
                .slice(1)
                .reduce((a, c) => {
                  const lines = c.split("\n");
                  const name = lines.shift()?.trim();
                  if (name === undefined) {
                    console.log(c);
                    throw new Error("no title");
                  }
                  const value = lines.join("\n").trim();
                  a.push({
                    name,
                    value,
                  });
                  return a;
                }, [] as Preset[]);
              return {
                groupName,
                presets,
              };
            }),
        ),
      ),
      fetch("/default-config.yaml").then((r) => r.text()),
      // .then((t) => yaml.parse(t)),
    ]).then(([p, t]) => {
      setPresetGroups(p);
      setLanguageDefaultConfigStr(t);
    });
  }, []);

  if (languageDefaultConfigStr === null || presetGroups === null) {
    return <div>loading</div>;
  }

  return (
    <RankiV2Demo
      languageDefaultConfig={yaml.parse(languageDefaultConfigStr)}
      initialLanguageUserConfigStr={languageDefaultConfigStr}
      presetGroups={presetGroups}
    />
  );
}

export default App;
