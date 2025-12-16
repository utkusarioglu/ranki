import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { PluginCard } from "./plugin-card/PluginCard";
import style from "./DqmPluginsOptions.module.css";
import type {
  SetPluginMemberEnabled,
  SetPluginEnabled,
  SetPluginInstalled,
} from "_stores/dqm/dqm.store.types.mjs";

export interface WithSetPluginMemberEnabled {
  setPluginMemberEnabled: SetPluginMemberEnabled;
}

export interface WithSetPluginEnabledInstalled {
  setPluginEnabled: SetPluginEnabled;
  setPluginInstalled: SetPluginInstalled;
}

export const DqmPluginsOptions = () => {
  const dqm = useDqmStore();

  return (
    <div className={style.container}>
      {dqm.pluginSelection.map((plugin) => (
        <PluginCard
          key={plugin.name}
          plugin={plugin}
          setPluginMemberEnabled={dqm.setPluginMemberEnabled}
          setPluginEnabled={dqm.setPluginEnabled}
          setPluginInstalled={dqm.setPluginInstalled}
        />
      ))}
    </div>
  );
};
