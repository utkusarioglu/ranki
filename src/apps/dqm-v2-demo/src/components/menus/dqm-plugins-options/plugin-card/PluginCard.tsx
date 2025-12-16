import type { PluginStoreType } from "_stores/dqm/dqm.store.types.mjs";
import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { Flex, Typography } from "antd";
import type { FC } from "react";
import style from "./PluginCard.module.css";
import type { WithPluginActions } from "../DqmPluginsOptions";

type PluginMemberProps = WithPluginActions & {
  plugin: PluginStoreType;
};

export const PluginMember: FC<PluginMemberProps> = ({
  plugin: {
    name,
    pluginType,
    packageIndex,
    pluginIndex,
    description,
    installed,
    requested,
    standard,
  },
  setPluginAsStandard,
  setPluginAsRequested,
  setPluginAsInstalled,
}) => {
  return (
    <div className={style.container}>
      <div>
        <Typography.Title code level={4} className={style.title}>
          {name}
        </Typography.Title>
        <Typography.Text code type="secondary">
          {pluginType}
        </Typography.Text>
      </div>

      <Typography className={style.text}>{description}</Typography>

      <Flex justify="end" className={style.controls}>
        <BlockySwitch
          checkedChildren={"Std"}
          unCheckedChildren={"!Std"}
          size="small"
          onChange={(v) => setPluginAsStandard(packageIndex, pluginIndex, v)}
          value={standard}
        />
        <BlockySwitch
          checkedChildren={"Req"}
          unCheckedChildren={"!Req"}
          size="small"
          onChange={(v) => setPluginAsRequested(packageIndex, pluginIndex, v)}
          value={requested}
        />
        <BlockySwitch
          checkedChildren={"Inst"}
          unCheckedChildren={"!Inst"}
          size="small"
          onChange={(v) => setPluginAsInstalled(packageIndex, pluginIndex, v)}
          value={installed}
        />
      </Flex>
    </div>
  );
};
