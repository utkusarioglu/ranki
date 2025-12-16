import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { Button } from "antd";
import { DqmConfigEntry } from "./DqmConfigEntry";
import style from "./DqmConfigOptions.module.css";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";

export const DqmConfigOptions = () => {
  const dqm = useDqmStore();
  return (
    <div className={style.container}>
      {dqm.configPack.map((entry) => (
        <DqmConfigEntry key={entry.id} entry={entry} />
      ))}

      <DqmConfigEntry
        entry={buildPluginSelectionConfig(dqm.pluginSelection)}
        message="This configuration entry is controlled by the Plugins tab"
        editable={false}
      />
      <Button block>Add Config</Button>
    </div>
  );
};
