import type { PluginMember as PluginMemberType } from "_stores/dqm/dqm.store.types.mjs";
import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { Card, Flex, Typography } from "antd";
import type { FC } from "react";
import style from "./PluginMember.module.css";
import type { WithSetPluginMemberEnabled } from "../DqmPluginsOptions";

type PluginMemberProps = WithSetPluginMemberEnabled & {
  member: PluginMemberType;
};

export const PluginMember: FC<PluginMemberProps> = ({
  member,
  setPluginMemberEnabled: setMemberVisibility,
}) => {
  return (
    <Card type="inner" size="small" className={style.container}>
      {/* <Flex justify="space-between" align="center"> */}
      <div>
        <Typography.Title code level={4} className={style.title}>
          {member.name}
        </Typography.Title>
        <Typography.Text code type="secondary">
          {member.memberType}
        </Typography.Text>
      </div>
      {/* </Flex> */}
      <Typography.Text>{member.description}</Typography.Text>
      <Flex justify="end">
        <BlockySwitch
          checkedChildren={"Installed"}
          unCheckedChildren={"Excluded"}
          size="small"
          onChange={(v) =>
            setMemberVisibility(member.pluginIndex, member.memberIndex, v)
          }
          value={member.enabled}
        />
      </Flex>
    </Card>
  );
};
