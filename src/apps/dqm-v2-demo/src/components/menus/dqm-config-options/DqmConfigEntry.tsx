import { CloseOutlined } from "@ant-design/icons";
import { SkinnyCard } from "_views/skinny-card/SkinnyCard";
import { Button, Flex, Input, Typography } from "antd";
import { useEffect, useState, type FC } from "react";
import style from "./DqmConfigEntry.module.css";
import type { ConfigInput } from "_stores/dqm/dqm.store.types.mjs";
import type { DqmConfig } from "@dqm/package-dqm-api-v2";
import yaml from "yaml";
import type { BaseType } from "antd/es/typography/Base";

interface DqmConfigEntryProps {
  entry: ConfigInput;
  setCode: (code: string) => void;
  setValue: (configStr: string, config: DqmConfig) => void;
  removeConfig: () => void;
}

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

function useLocalState({
  entry: { configString },
  setValue,
}: Pick<DqmConfigEntryProps, "setValue" | "entry">) {
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
        setValue("", {} as DqmConfig);
        return;
      }
      try {
        const parsed = yaml.parse(value);
        setLocal({
          configStr: value,
          message: null,
        });
        setValue(value, parsed);
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

export const DqmConfigEntry: FC<DqmConfigEntryProps> = ({
  entry,
  setCode,
  setValue,
  removeConfig,
}) => {
  const { message, configStr, setConfigCode } = useLocalState({
    entry,
    setValue,
  });

  return (
    <SkinnyCard>
      <Flex className={style.row}>
        <Input
          value={entry.id}
          className={style.input}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button icon={<CloseOutlined />} onClick={() => removeConfig()} />
      </Flex>
      <Input.TextArea
        className={style.textarea}
        value={configStr}
        autoSize
        onChange={(e) => setConfigCode(e.target.value)}
      />
      {message !== null ? (
        <div className={style.message}>
          <Typography.Text type={message.type}>{message.text}</Typography.Text>
        </div>
      ) : null}
    </SkinnyCard>
  );
};
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
