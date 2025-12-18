import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { Button, Flex, Form } from "antd";
import { dqmConfigEntryFactory, DqmConfigEntryFixed } from "./DqmConfigEntry";
import style from "./DqmConfigOptions.module.css";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";
import yaml from "yaml";
import { UpdatesForm } from "_menus/dqm-input-options/updates-form/UpdatesForm";
import { ReorderList } from "_views/reorder-list/ReorderList";
import { useCallback } from "react";

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
      setConfigCodeByIndex: dqm.setConfigCodeByIndex,
      setConfigValueByIndex: dqm.setConfigValueByIndex,
      removeConfigByIndex: dqm.removeConfigByIndex,
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
          enableDrag
          list={dqm.configPack}
          id="configPack"
          component={component}
          onChange={dqm.setAllConfig}
        />

        <DqmConfigEntryFixed
          entry={{
            id: fixedConfig.id,
            config: fixedConfig.config,
            configString: yaml.stringify(fixedConfig.config),
          }}
          message="This entry is controlled by the Plugins tab"
        />
      </div>

      <Flex className={style.band}>
        <Button onClick={() => dqm.pushNewConfig()} block>
          Add Config
        </Button>
      </Flex>
    </>
  );
};
