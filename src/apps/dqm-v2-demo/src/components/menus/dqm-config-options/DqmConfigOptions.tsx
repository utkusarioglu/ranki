import { UpdatesForm } from "_menus/dqm-input-options/updates-form/UpdatesForm";
import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";
import { ReorderList } from "_views/reorder-list/ReorderList";
import { Button, Flex, Form } from "antd";
import { useCallback } from "react";
import yaml from "yaml";

import { dqmConfigEntryFactory, DqmConfigEntryFixed } from "./DqmConfigEntry";
import style from "./DqmConfigOptions.module.css";

export const DqmConfigOptions = () => {
  const dqm = useDqmStore();

  // const setCode = (i: number) => (code: string) => {
  //   dqm.setConfigCodeByIndex(i, code);
  // };

  // const setValue = (i: number) => (configStr: string, config: DqmConfig) => {
  //   dqm.setConfigValueByIndex(i, configStr, config);
  // };

  // const removeConfig = (i: number) => () => {
  //   dqm.removeConfigByIndex(i);
  // };

  const component = useCallback(
    dqmConfigEntryFactory({
      removeConfigByIndex: dqm.removeConfigByIndex,
      setConfigCodeByIndex: dqm.setConfigCodeByIndex,
      setConfigValueByIndex: dqm.setConfigValueByIndex,
    }),
    [],
  );
  const fixedConfig = buildPluginSelectionConfig(dqm.pluginSelection);

  return (
    <>
      <Form className={style.band}>
        <UpdatesForm />
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

      <Flex className={style.band}>
        <Button block onClick={() => dqm.pushNewConfig()}>
          Add Config
        </Button>
      </Flex>
    </>
  );
};
