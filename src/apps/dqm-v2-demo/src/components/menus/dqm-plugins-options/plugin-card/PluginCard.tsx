import type { PluginData } from "_stores/dqm/dqm.store.types.mjs";
import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { Card, Flex, Typography } from "antd";
import type { FC } from "react";
import { PluginMember } from "../plugin-member/PluginMember";
import style from "./PluginCard.module.css";
import type {
  WithSetPluginEnabledInstalled,
  WithSetPluginMemberEnabled,
} from "../DqmPluginsOptions";

type PluginCardProps = WithSetPluginMemberEnabled &
  WithSetPluginEnabledInstalled & {
    plugin: PluginData;
  };

export const PluginCard: FC<PluginCardProps> = ({
  plugin,
  setPluginMemberEnabled,
  setPluginEnabled,
  setPluginInstalled,
}) => {
  return (
    <Card className={style.container}>
      <Flex justify="space-between" align="center">
        <Typography.Title level={4} className={style.title}>
          {plugin.name}
        </Typography.Title>
      </Flex>
      <div>
        {plugin.members.map((member) => (
          <PluginMember
            key={member.memberType + member.name}
            member={member}
            setPluginMemberEnabled={setPluginMemberEnabled}
          />
        ))}
      </div>
      <Flex justify="end">
        <BlockySwitch
          checkedChildren={"Enabled"}
          unCheckedChildren={"Disabled"}
          onChange={(e) => setPluginEnabled(plugin.pluginIndex, e)}
          value={plugin.enabled}
        />
        <BlockySwitch
          checkedChildren={"Installed"}
          unCheckedChildren={"Skipped"}
          onChange={(e) => setPluginInstalled(plugin.pluginIndex, e)}
          value={plugin.installed}
        />
      </Flex>
    </Card>
  );
};
