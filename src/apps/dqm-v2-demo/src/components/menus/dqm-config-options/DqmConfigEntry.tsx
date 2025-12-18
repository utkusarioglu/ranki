import { CloseOutlined } from "@ant-design/icons";
import { SkinnyCard } from "_views/skinny-card/SkinnyCard";
import { Button, Flex, Input, Typography } from "antd";
import { useEffect, useState, type FC, type Ref } from "react";
import style from "./DqmConfigEntry.module.css";
import type { ConfigInput } from "_stores/dqm/dqm.store.types.mjs";
import type { DqmConfig } from "@dqm/package-dqm-api-v2";
import yaml from "yaml";
import type { BaseType } from "antd/es/typography/Base";

type CardMessage = null | {
  type: BaseType;
  text: string;
};

const ERROR_MESSAGE: CardMessage = {
  type: "danger",
  text: "This config is current ignored because it is not a valid yaml document.",
};

const WHITESPACE_MESSAGE: CardMessage = {
  type: "secondary",
  text: "This entry is currently being ignored because it only consists of whitespace.",
};

const EMPTY_MESSAGE: CardMessage = {
  type: "secondary",
  text: "This entry is currently being ignored because it is empty.",
};

const INITIAL_MESSAGE: CardMessage = {
  type: "secondary",
  text: "Awaiting configuration and key.",
};

type LocalState = {
  message: CardMessage;
  configStr: string;
};

type UseLocalStateParams = {
  item: ConfigInput;
  setConfigValueByIndex: DqmConfigEntryFactoryFuncProps["setConfigValueByIndex"];
  index: number;
};

function useLocalState({
  item: { configString },
  setConfigValueByIndex,
  index,
}: UseLocalStateParams) {
  const [local, setLocal] = useState<LocalState>({
    configStr: "",
    message: null,
  });

  useEffect(() => {
    setLocal({
      configStr: configString,
      message: INITIAL_MESSAGE,
    });
  }, []);

  return {
    message: local.message,
    configStr: local.configStr,
    setConfigCode: (value: string) => {
      if (value.trim().length === 0) {
        setLocal({
          message: value.length > 0 ? WHITESPACE_MESSAGE : EMPTY_MESSAGE,
          configStr: value,
        });
        setConfigValueByIndex(index, "", {} as DqmConfig);
        return;
      }
      try {
        const parsed = yaml.parse(value);
        setLocal({
          configStr: value,
          message: null,
        });
        setConfigValueByIndex(index, value, parsed);
      } catch (e) {
        setLocal({
          configStr: value,
          message: ERROR_MESSAGE,
        });
        console.log(e);
      }
    },
  };
}

interface DqmConfigEntryFixedProps {
  entry: ConfigInput;
  message: string;
}

export const DqmConfigEntryFixed: FC<DqmConfigEntryFixedProps> = ({
  entry,
  message,
}) => {
  return (
    <SkinnyCard>
      <Flex className={style.row}>
        <Input value={entry.id} disabled className={style.input} />
        <Button icon={<CloseOutlined />} disabled />
      </Flex>
      <Input.TextArea
        className={style.textarea}
        value={entry.configString}
        autoSize
        disabled
      />
      <div className={style.message}>
        <Typography.Text type="secondary">{message}</Typography.Text>
      </div>
    </SkinnyCard>
  );
};

interface DqmConfigEntryFactoryFuncProps {
  setConfigCodeByIndex: (index: number, code: string) => void;
  setConfigValueByIndex: (
    index: number,
    configStr: string,
    config: DqmConfig,
  ) => void;
  removeConfigByIndex: (index: number) => void;
}

type DqmConfigEntryFactoryFunc = (
  p: DqmConfigEntryFactoryFuncProps,
) => FC<DqmConfigEntryProps>;

interface DqmConfigEntryProps {
  item: ConfigInput;
  index: number;
  ref: Ref<HTMLDivElement>;
}

export const dqmConfigEntryFactory: DqmConfigEntryFactoryFunc =
  ({ setConfigCodeByIndex, setConfigValueByIndex, removeConfigByIndex }) =>
  ({ item, index, ref }) => {
    const { message, configStr, setConfigCode } = useLocalState({
      item,
      setConfigValueByIndex,
      index,
    });

    return (
      <SkinnyCard ref={ref} style={{ cursor: "grabbing" }}>
        <Flex className={style.row}>
          <Input
            value={item.id}
            className={style.input}
            onChange={(e) => setConfigCodeByIndex(index, e.target.value)}
          />
          <Button
            icon={<CloseOutlined />}
            onClick={() => removeConfigByIndex(index)}
          />
        </Flex>
        <Input.TextArea
          className={style.textarea}
          value={configStr}
          autoSize
          onChange={(e) => setConfigCode(e.target.value)}
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
