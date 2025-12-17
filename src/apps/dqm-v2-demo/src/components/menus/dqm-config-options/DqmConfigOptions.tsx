import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { Button, Flex, Form } from "antd";
import { DqmConfigEntry, DqmConfigEntryFixed } from "./DqmConfigEntry";
import style from "./DqmConfigOptions.module.css";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";
import yaml from "yaml";
import type { DqmConfig } from "@dqm/package-dqm-api-v2";
import { UpdatesForm } from "_menus/dqm-input-options/updates-form/UpdatesForm";

export const DqmConfigOptions = () => {
  const dqm = useDqmStore();

  const setCode = (i: number) => (code: string) => {
    dqm.setConfigCodeByIndex(i, code);
  };

  const setValue = (i: number) => (configStr: string, config: DqmConfig) => {
    dqm.setConfigValueByIndex(i, configStr, config);
  };

  const removeConfig = (i: number) => () => {
    dqm.removeConfigByIndex(i);
  };

  const fixedConfig = buildPluginSelectionConfig(dqm.pluginSelection);

  return (
    <>
      <Form className={style.band}>
        <UpdatesForm />
      </Form>
      <div className={style.container}>
        {dqm.configPack.map((entry, i) => (
          <DqmConfigEntry
            key={i}
            entry={entry}
            setCode={setCode(i)}
            setValue={setValue(i)}
            removeConfig={removeConfig(i)}
          />
        ))}

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
