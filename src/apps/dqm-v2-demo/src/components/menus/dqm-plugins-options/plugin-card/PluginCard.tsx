import type { PluginStoreType } from "_stores/dqm/dqm.store.types.mjs";
import type { FC } from "react";

import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { Flex, Typography } from "antd";

import type { WithPluginActions } from "../DqmPluginsOptions";

import style from "./PluginCard.module.css";

type PluginMemberProps = {
  plugin: PluginStoreType;
} & WithPluginActions;

export const PluginMember: FC<PluginMemberProps> = ({
  plugin: {
    description,
    installed,
    name,
    packageIndex,
    pluginIndex,
    pluginType,
    requested,
    standard,
  },
  setPluginAsInstalled,
  setPluginAsRequested,
  setPluginAsStandard,
}) => {
  return (
    <div className={style.container}>
      <div>
        <Typography.Title className={style.title} code level={4}>
          {name}
        </Typography.Title>
        <Typography.Text code type="secondary">
          {pluginType}
        </Typography.Text>
      </div>

      <Typography className={style.text}>{description}</Typography>

      <Flex className={style.controls} justify="space-between">
        <Flex className={style.controls}>
          <BlockySwitch
            checkedChildren={"Std"}
            onChange={(v) => setPluginAsStandard(packageIndex, pluginIndex, v)}
            size="small"
            unCheckedChildren={"!Std"}
            value={standard}
          />
          <BlockySwitch
            checkedChildren={"Req"}
            onChange={(v) => setPluginAsRequested(packageIndex, pluginIndex, v)}
            size="small"
            unCheckedChildren={"!Req"}
            value={requested}
          />
        </Flex>
        <BlockySwitch
          checkedChildren={"Inst"}
          onChange={(v) => setPluginAsInstalled(packageIndex, pluginIndex, v)}
          size="small"
          unCheckedChildren={"!Inst"}
          value={installed}
        />
      </Flex>
    </div>
  );
};
