import type { ConfigInput } from "_stores/dqm/dqm.store.types.mjs";
import type { DqmConfig } from "@dqm/package-dqm-api-v2";
import type { BaseType } from "antd/es/typography/Base";

import { SkinnyCard } from "_views/skinny-card/SkinnyCard";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Typography } from "antd";
import { type FC, type Ref, useEffect, useState } from "react";
import yaml from "yaml";

import style from "./DqmConfigEntry.module.css";

type CardMessage = {
  text: string;
  type: BaseType;
} | null;

const ERROR_MESSAGE: CardMessage = {
  text: "This config is current ignored because it is not a valid yaml document.",
  type: "danger",
};

const WHITESPACE_MESSAGE: CardMessage = {
  text: "This entry is currently being ignored because it only consists of whitespace.",
  type: "secondary",
};

const EMPTY_MESSAGE: CardMessage = {
  text: "This entry is currently being ignored because it is empty.",
  type: "secondary",
};

const INITIAL_MESSAGE: CardMessage = {
  text: "Awaiting configuration and key.",
  type: "secondary",
};

interface DqmConfigEntryFixedProps {
  entry: ConfigInput;
  message: string;
}

type LocalState = {
  configStr: string;
  message: CardMessage;
};

type UseLocalStateParams = {
  index: number;
  item: ConfigInput;
  setConfigValueByIndex: DqmConfigEntryFactoryFuncProps["setConfigValueByIndex"];
};

function useLocalState({
  index,
  item: { configString },
  setConfigValueByIndex,
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
    configStr: local.configStr,
    message: local.message,
    setConfigCode: (value: string) => {
      if (value.trim().length === 0) {
        setLocal({
          configStr: value,
          message: value.length > 0 ? WHITESPACE_MESSAGE : EMPTY_MESSAGE,
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
        // console.log(e);
      }
    },
  };
}

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

type DqmConfigEntryFactoryFunc = (
  p: DqmConfigEntryFactoryFuncProps,
) => FC<DqmConfigEntryProps>;

interface DqmConfigEntryFactoryFuncProps {
  removeConfigByIndex: (index: number) => void;
  setConfigCodeByIndex: (index: number, code: string) => void;
  setConfigValueByIndex: (
    index: number,
    configStr: string,
    config: DqmConfig,
  ) => void;
}

interface DqmConfigEntryProps {
  index: number;
  item: ConfigInput;
  ref: Ref<HTMLDivElement>;
}

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
