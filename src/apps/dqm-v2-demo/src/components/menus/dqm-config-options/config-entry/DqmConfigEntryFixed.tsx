import { SkinnyCard } from "_views/skinny-card/SkinnyCard";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Typography } from "antd";
import { type FC } from "react";

import style from "./DqmConfigEntry.module.css";
import type { DqmConfigEntryFixedProps } from "./DqmConfigEntryFixed.types.mts";

export const DqmConfigEntryFixed: FC<DqmConfigEntryFixedProps> = ({
  entry,
  message,
}) => {
  return (
    <SkinnyCard>
      <Flex className={style.row}>
        <Input className={style.input} disabled value={entry.id} />
        <Button disabled icon={<CloseOutlined />} />
      </Flex>
      <Input.TextArea
        autoSize
        className={style.textarea}
        disabled
        value={entry.configString}
      />
      <div className={style.message}>
        <Typography.Text type="secondary">{message}</Typography.Text>
      </div>
    </SkinnyCard>
  );
};
