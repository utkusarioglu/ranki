import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { Button, Flex } from "antd";
import { DqmConfigEntry } from "./DqmConfigEntry";
import style from "./DqmConfigOptions.module.css";
import { buildPluginSelectionConfig } from "_stores/dqm/dqm.utils.mjs";
import yaml from "yaml";

export const DqmConfigOptions = () => {
  const dqm = useDqmStore();

  const setCode = (i: number) => (code: string) => {
    dqm.setConfigCodeByIndex(i, code);
  };

  const setValue = (i: number) => (value: string) => {
    dqm.setConfigValueByIndex(i, value);
  };

  const removeConfig = (i: number) => () => {
    dqm.removeConfigByIndex(i);
  };

  const fixedConfig = buildPluginSelectionConfig(dqm.pluginSelection);

  return (
    <>
      <div className={style.container}>
        {dqm.configPack.map((entry, i) => (
          <DqmConfigEntry
            key={entry.configCode}
            entry={entry}
            setCode={setCode(i)}
            setValue={setValue(i)}
            removeConfig={removeConfig(i)}
          />
        ))}

        <DqmConfigEntry
          entry={{
            configCode: fixedConfig.id,
            configString: yaml.stringify(fixedConfig.config),
          }}
          message="This configuration entry is controlled by the Plugins tab"
          editable={false}
          setCode={setCode(0)}
          setValue={setValue(0)}
          removeConfig={removeConfig(0)}
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
