import { SkinnyCard } from "_views/skinny-card/SkinnyCard";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Typography } from "antd";

import style from "./DqmConfigEntry.module.css";
import type { DqmConfigEntryFactoryFunc } from "./dqmConfigEntryFactory.types.mts";
import { useLocalState } from "./useLocalState";

export const dqmConfigEntryFactory: DqmConfigEntryFactoryFunc =
  ({ removeConfigByIndex, setConfigCodeByIndex, setConfigValueByIndex }) =>
  ({ index, item, ref }) => {
    const { configStr, message, setConfigCode } = useLocalState({
      index,
      item,
      setConfigValueByIndex,
    });

    return (
      <SkinnyCard ref={ref} style={{ cursor: "grabbing" }}>
        <Flex className={style.row}>
          <Input
            className={style.input}
            onChange={(e) => setConfigCodeByIndex(index, e.target.value)}
            value={item.id}
          />
          <Button
            icon={<CloseOutlined />}
            onClick={() => removeConfigByIndex(index)}
          />
        </Flex>
        <Input.TextArea
          autoSize
          className={style.textarea}
          onChange={(e) => setConfigCode(e.target.value)}
          value={configStr}
        />
        {message !== null ? (
          <div className={style.message}>
            <Typography.Text type={message.type}>
              {message.text}
            </Typography.Text>
          </div>
        ) : null}
      </SkinnyCard>
    );
  };
