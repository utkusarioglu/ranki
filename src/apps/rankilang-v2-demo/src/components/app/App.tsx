import { Output } from "../output/Output";
import style from "./app.module.css";
import { Inputs } from "../inputs/Inputs";
import { useEffect, useState } from "react";
import type { PresetGroup } from "../../services/preset/preset.types";
import { fetchPresets } from "../../services/preset/preset.mjs";
import yaml from "yaml";

function usePublicData() {
  const [languageDefaultConfigStr, setLanguageDefaultConfigStr] = useState<
    string | null
  >(null);
  const [presetGroups, setPresetGroups] = useState<PresetGroup[] | null>(null);

  useEffect(() => {
    Promise.all([
      fetchPresets(),
      fetch("/default-config.yaml").then((r) => r.text()),
    ]).then(([pg, dc]) => {
      setPresetGroups(pg);
      setLanguageDefaultConfigStr(dc);
    });
  }, []);

  const isLoading = languageDefaultConfigStr === null || presetGroups === null;

  if (isLoading) {
    return {
      isLoading,
      languageDefaultConfigStr: "",
      presetGroups: [],
    };
  }

  return {
    isLoading,
    languageDefaultConfigStr,
    presetGroups,
  };
}

export function App() {
  const { languageDefaultConfigStr, presetGroups, isLoading } = usePublicData();
  const [parsed, setRankiParsed] = useState<object | null>(null);

  if (isLoading) {
    return <div className={style.loading}>Loading…</div>;
  }

  return (
    <div className={[style.layout].join(" ")}>
      <Inputs
        setRankiParsed={setRankiParsed}
        languageDefaultConfig={yaml.parse(languageDefaultConfigStr)}
        presetGroups={presetGroups}
        initialLanguageUserConfigStr={languageDefaultConfigStr}
      />
      <Output parsed={parsed} />
    </div>
  );
}
