import { CloseOutlined } from "@ant-design/icons";
import { SkinnyCard } from "_views/skinny-card/SkinnyCard";
import { Button, Flex, Input, Typography } from "antd";
import type { FC } from "react";
import yaml from "yaml";
import style from "./DqmConfigEntry.module.css";
import type { DqmConfigPackEntry } from "@dqm/package-dqm-api-v2";

interface DqmConfigEntryProps {
  entry: DqmConfigPackEntry;
  editable?: boolean;
  message?: string;
}

export const DqmConfigEntry: FC<DqmConfigEntryProps> = ({
  entry,
  editable = true,
  message,
}) => {
  return (
    <SkinnyCard>
      <Flex className={style.row}>
        <Input value={entry.id} disabled={!editable} />
        <Button icon={<CloseOutlined />} disabled={!editable} />
      </Flex>
      <Input.TextArea
        className={style.textarea}
        value={yaml.stringify(entry.config)}
        autoSize
        disabled={!editable}
      />
      {message ? (
        <div className={style.message}>
          <Typography.Text type="secondary">{message}</Typography.Text>
        </div>
      ) : null}
    </SkinnyCard>
  );
};
