import { CloseOutlined } from "@ant-design/icons";
import { SkinnyCard } from "_views/skinny-card/SkinnyCard";
import { Button, Flex, Input, Typography } from "antd";
import type { FC } from "react";
import style from "./DqmConfigEntry.module.css";
import type { ConfigInput } from "_stores/dqm/dqm.store.types.mjs";

interface DqmConfigEntryProps {
  entry: ConfigInput;
  editable?: boolean;
  message?: string;
  setCode: (code: string) => void;
  setValue: (value: string) => void;
  removeConfig: () => void;
}

export const DqmConfigEntry: FC<DqmConfigEntryProps> = ({
  entry,
  editable = true,
  message,
  setCode,
  setValue,
  removeConfig,
}) => {
  return (
    <SkinnyCard>
      <Flex className={style.row}>
        <Input
          value={entry.configCode}
          disabled={!editable}
          className={style.input}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button
          icon={<CloseOutlined />}
          disabled={!editable}
          onClick={() => removeConfig()}
        />
      </Flex>
      <Input.TextArea
        className={style.textarea}
        value={entry.configString}
        autoSize
        disabled={!editable}
        onChange={(e) => setValue(e.target.value)}
      />
      {message ? (
        <div className={style.message}>
          <Typography.Text type="secondary">{message}</Typography.Text>
        </div>
      ) : null}
    </SkinnyCard>
  );
};
