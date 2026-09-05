import type { DqmConfig } from "@dqm/package-dqm-api-v2";
import type { ConfigInput } from "_stores/dqm/dqm.store.types.mjs";
import type { BaseType } from "antd/es/typography/Base";
import type { FC, Ref } from "react";

export type CardMessage = {
  text: string;
  type: BaseType;
} | null;
//
export type DqmConfigEntryFactoryFunc = (
  p: DqmConfigEntryFactoryFuncProps,
) => FC<DqmConfigEntryProps>;

export interface DqmConfigEntryFactoryFuncProps {
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
