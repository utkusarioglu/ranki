import type { DqmConfig } from "@dqm/package-dqm-api-v2";
import { useState, useEffect } from "react";
import yaml from "yaml";
import {
  INITIAL_MESSAGE,
  WHITESPACE_MESSAGE,
  EMPTY_MESSAGE,
  ERROR_MESSAGE,
} from "./DqmConfigEntry.constants.mts";
import type { UseLocalStateParams } from "./useLocalState.types.mts";
import type { LocalState } from "./useLocalState.types.mts";

export function useLocalState({
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
      } catch {
        setLocal({
          configStr: value,
          message: ERROR_MESSAGE,
        });
      }
    },
  };
}
