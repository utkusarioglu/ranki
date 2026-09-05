import { UpdatesForm } from "_menus/dqm-input-options/updates-form/UpdatesForm";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";
import { ReorderList } from "_views/reorder-list/ReorderList";
import { Form } from "antd";
import { useCallback } from "react";
import yaml from "yaml";

import { dqmConfigEntryFactory } from "./config-entry/dqmConfigEntryFactory";
import style from "./DqmConfigOptions.module.css";
import { ConfigForm } from "./config-form/ConfigForm";
import { DqmConfigEntryFixed } from "./config-entry/DqmConfigEntryFixed";

export const DqmConfigOptions = () => {
  const dqm = useDqmStore();

  const component = useCallback(
    dqmConfigEntryFactory({
      removeConfigByIndex: dqm.removeConfigByIndex,
      setConfigCodeByIndex: dqm.setConfigCodeByIndex,
      setConfigValueByIndex: dqm.setConfigValueByIndex,
    }),
    [dqm],
  );
  const fixedConfig = buildPluginSelectionConfig(dqm.pluginSelection);

  return (
    <>
      <Form className={style.band}>
        <UpdatesForm />
        <ConfigForm />
      </Form>

      <div className={style.container}>
        <ReorderList
          component={component}
          enableDrag
          id="configPack"
          list={dqm.configPack}
          onChange={dqm.setAllConfig}
        />

        <DqmConfigEntryFixed
          entry={{
            config: fixedConfig.config,
            configString: yaml.stringify(fixedConfig.config),
            id: fixedConfig.id,
          }}
          message="This entry is controlled by the Plugins tab"
        />
      </div>
    </>
  );
};
