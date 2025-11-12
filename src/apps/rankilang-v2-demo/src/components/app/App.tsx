import { Output } from "../output/Output";
import style from "./app.module.css";
import { Inputs } from "../inputs/Inputs";
import { useDeferredValue, useEffect, useState } from "react";
import type { PresetGroup } from "../../services/preset/preset.types";
import { fetchPresets } from "../../services/preset/preset.mjs";
import yaml from "yaml";
import type { SharedState } from "./shared-state.mts";

function usePublicData() {
  const [languageDefaultConfigStr, setLanguageDefaultConfigStr] = useState<
    string | null
  >(null);
  const [presetGroups, setPresetGroups] = useState<PresetGroup[] | null>(null);

  useEffect(() => {
    Promise.all([
      fetchPresets(),
      fetch("/user-config.yaml").then((r) => r.text()),
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
  const [sharedState, setSharedState] = useState<SharedState>(null);
  const deferredState = useDeferredValue(sharedState);

  if (isLoading) {
    return (
      <div className={[style.loading, "monospace"].join(" ")}>Loading…</div>
    );
  }

  return (
    <div className={[style.layout].join(" ")}>
      <Inputs
        setSharedState={setSharedState}
        languageDefaultConfig={yaml.parse(languageDefaultConfigStr)}
        presetGroups={presetGroups}
        initialLanguageUserConfigStr={languageDefaultConfigStr}
      />
      <Output state={deferredState} />
    </div>
  );
}
