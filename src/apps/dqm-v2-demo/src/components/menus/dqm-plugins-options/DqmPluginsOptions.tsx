import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { PluginCard } from "./plugin-package-card/PluginPackageCard";
import style from "./DqmPluginsOptions.module.css";
import type {
  SetPluginAsInstalled,
  SetPluginAsRequested,
  SetPluginAsStandard,
  SetPluginPackageAsEnabled,
} from "_stores/dqm/dqm.store.types.mjs";

export interface WithPluginActions {
  setPluginAsInstalled: SetPluginAsInstalled;
  setPluginAsStandard: SetPluginAsStandard;
  setPluginAsRequested: SetPluginAsRequested;
}

export interface WithPluginPackageActions {
  setPluginPackageAsEnabled: SetPluginPackageAsEnabled;
}

export const DqmPluginsOptions = () => {
  const dqm = useDqmStore();

  return (
    <div className={style.container}>
      {dqm.pluginSelection.map((pluginPackage) => (
        <PluginCard
          key={pluginPackage.name}
          pluginPackage={pluginPackage}
          setPluginAsInstalled={dqm.setPluginAsInstalled}
          setPluginAsRequested={dqm.setPluginAsRequested}
          setPluginAsStandard={dqm.setPluginAsStandard}
          setPluginPackageAsEnabled={dqm.setPluginPackageAsEnabled}
        />
      ))}
    </div>
  );
};
